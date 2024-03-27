const FeaturedVideo = require("../model/featuredImg");
const Moderator = require("../model/moderator");
const Plan = require("../model/plan");
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
    console.log(err);
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
      expiresIn: "90d",
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

const deleteFeaturedImage = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const featuredVideo = await FeaturedVideo.findOneAndDelete({
      _id: videoId,
    });

    if (!featuredVideo) {
      return res.status(404).json({
        status: "fail",
        message: "Video not found",
      });
    }

    res.status(204).json({
      status: "success",
      message: "Video deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getFeaturedImageById = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const featuredVideo = await FeaturedVideo.findOne({
      _id: videoId,
    });

    if (!featuredVideo) {
      return res.status(404).json({
        status: "fail",
        message: "Video not found",
      });
    }
    res.status(200).json(featuredVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const savePassword = async (req, res) => {
  const { password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        status: "fail",
        message: "Password not found",
      });
    }
    const existingModerator = await Moderator.findOne();
    if (existingModerator) {
      return res.status(400).json({
        status: "fail",
        message: "Password already exists, use update endpoint",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const moderator = new Moderator({ password: encryptedPassword });
    await moderator.save();
    res.status(201).json({ message: "Password saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        status: "fail",
        message: "Password not found",
      });
    }
    const moderator = await Moderator.findById(id);
    if (!moderator) {
      return res.status(404).json({
        status: "fail",
        message: "Moderator not found",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    moderator.password = encryptedPassword;
    await moderator.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const plan = new Plan({ title, description, price, imageUrl });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      { title, description, price, imageUrl },
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSinglePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSinglePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginPassword = async (req, res) => {
  const { password } = req.body;

  const moderator = await Moderator.findOne();
  if (!moderator) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const passwordMatch = await bcrypt.compare(password, moderator.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: moderator._id },
    "wake-eat-work-sleep-wake-eat-work-sleep",
    {
      expiresIn: "90d",
    }
  );

  res.status(201).json({ status: "Success", token });
};

const authentication_login = async (req, res, next) => {
  let { id } = req.data;

  if (id) {
    try {
      const data = await Moderator.findById(id);
      if (data) {
        return res.status(201).json({ status: "success", password: true });
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
  savePassword: savePassword,
  createPlan: createPlan,
  updatePlan: updatePlan,
  getSinglePlan: getSinglePlan,
  deleteSinglePlan: deleteSinglePlan,
  authentication_login: authentication_login,
  getPlans: getPlans,
  featureVideosList: featureVideosList,
  updatePassword: updatePassword,
  loginPassword: loginPassword,
  login,
  authentication,
  deleteFeaturedImage,
  getFeaturedImageById,
};
