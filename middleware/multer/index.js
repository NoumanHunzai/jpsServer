const multer = require("multer");
const path = require("path");

// Define allowed file extensions
const allowedExtensions = [".jpg", ".jpeg", ".png"];

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Filename will be the current timestamp + original filename
  },
});

// Validate file extension
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Allow file with valid extension
  } else {
    cb(
      new Error("Invalid file type. Only JPEG and PNG files are allowed."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
    files: 13, // 12 images + 1 cover image
  },
  fileFilter: fileFilter,
});

module.exports = upload;
