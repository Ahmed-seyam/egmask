const express = require("express");
const covidController = require("../controllers/covController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(covidController.getCovid)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    covidController.CreateCovid
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    covidController.updateCovid
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    covidController.deleteCovid
  );

module.exports = router;
