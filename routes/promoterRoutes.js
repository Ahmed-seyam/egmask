const express = require("express");
const promotersController = require("../controllers/promoterController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/signup",
  promotersController.uploadPromoterPhoto,
  promotersController.resizePromoterPhoto,
  authController.signupAsPromoter
);

router.post("/login", authController.login);
router.get("/logout", authController.logout);

// router.post("/forgotPassword", authController.forgotPasswordPromoter);
// router.patch("/resetPassword/:token", authController.resetPasswordPromoter);

// Protect all routes after this middleware
router.use(authController.protect);
router.patch("/updateMyPassword", authController.updatePasswordPromoter);
router.get("/me", promotersController.getMe, promotersController.getPromoter);
router.patch(
  "/updateMe",
  promotersController.uploadPromoterPhoto,
  promotersController.resizePromoterPhoto,
  promotersController.updateMePromoter
);
router.patch("/update-location", promotersController.updateLocations);
router.patch("/add-location", promotersController.addLocations);
router.delete("/remove-location", promotersController.deleteLocation);
router.patch("/update-product", promotersController.updateProducts);
router.delete("/deleteMe", promotersController.deleteMePromoter);

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(promotersController.getAllPromoters)
  .delete(promotersController.deletePromoter);

router
  .route("/:id")
  .get(promotersController.getPromoter)
  .patch(promotersController.updatePromoter);

module.exports = router;
