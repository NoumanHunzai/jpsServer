const express = require("express");
const userController = require("../controller/user");
const auth = require("../middleware/validation");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/login", userController.login);
router.get("/checksession", auth, userController.authentication);
router.post(
  "/featuredimage",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 12 },
  ]),
  userController.featureVideos
);
router.get("/featuredimages", userController.featureVideosList);
router.delete("/featuredimages/:id", userController.deleteFeaturedImage);
router.get("/featuredimages/:id", userController.getFeaturedImageById);

module.exports = router;
