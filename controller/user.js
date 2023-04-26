const FeaturedVideo = require("../model/featuredImg");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const featureVideos = async (req, res, next) => {
  try {
    const coverImageFile = req.files.coverImage[0];
    const imageFiles = req.files.images;

    // Save coverImage filename to FeaturedVideo model
    const featuredImg = new FeaturedVideo({
      title: req.body.title,
      coverImage: coverImageFile.filename,
      description: req.body.description,
    });

    // Save image filenames to FeaturedVideo model
    featuredImg.images = imageFiles.map((image) => ({
      imageUrl: image.filename,
    }));

    await featuredImg.save();

    res.status(201).json({
      status: "success",
      message: "Upload successful!",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
const featureVideosList = async (req, res, next) => {
  try {
    const result = await FeaturedVideo.find();
    if (!result) {
      return res.status(404).json({
        status: "Fail",
        message: "Not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign(
    { userId: user._id },
    "wake-eat-work-sleep-wake-eat-work-sleep",
    {
      expiresIn: "1h",
    }
  );

  res.status(201).json({ status: "Success", token });
};

const authentication = async (req, res, next) => {
  let id = req.data.userId;
  if (id) {
    try {
      const data = await User.findById(id);
      if (data) {
        return res
          .status(201)
          .json({ data: { id: data.userId, username: data.username } });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
module.exports = {
  featureVideos: featureVideos,
  featureVideosList: featureVideosList,
  login,
  authentication,
};
