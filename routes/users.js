const express = require("express");
const userController = require("../controller/user");
const auth = require("../middleware/validation");
const router = express.Router();

router.post("/login", userController.login);
router.get("/checksession", auth, userController.authentication);
router.post("/featuredvideos", userController.featureVideos);
router.get("/featuredvideos", userController.featureVideosList);

module.exports = router;
