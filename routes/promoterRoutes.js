const express = require("express");
const promotersController = require("../controllers/promoterController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(promotersController.getAllPromoters)
  .post(
    promotersController.uploadPromoterPhoto,
    promotersController.resizePromoterPhoto,
    promotersController.CreatePromoter
  )
  .delete(promotersController.deletePromoter);

router
  .route("/:id")
  .get(promotersController.getPromoter)
  .patch(promotersController.updatePromoter);

module.exports = router;
