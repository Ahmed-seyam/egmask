const express = require("express");
const productsController = require("../controllers/productsController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productsController.uploadProductPhoto,
    productsController.resizeProductPhoto,
    productsController.CreateProduct
  );

router
  .route("/:id")
  .get(
    authController.isLoggedIn,
    authController.pleaseLogIn,
    productsController.getProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productsController.uploadProductPhoto,
    productsController.resizeProductPhoto,
    productsController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productsController.deleteProduct
  );

module.exports = router;
