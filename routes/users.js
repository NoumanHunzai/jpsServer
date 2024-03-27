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

//Create Plan
router.get("/plan/:id", userController.getSinglePlan);
router.post("/plan", userController.createPlan);
router.get("/plans", userController.getPlans);
router.put("/plan/:id", userController.updatePlan);
router.delete("/plan/:id", userController.deleteSinglePlan);

//Protected Page Password
router.post("/password", userController.savePassword);
router.put("/password", userController.updatePassword);
router.post("/password-login", userController.loginPassword);
router.get("/checksession-client", auth, userController.authentication_login);

module.exports = router;
