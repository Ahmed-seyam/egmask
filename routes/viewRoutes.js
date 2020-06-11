const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(viewsController.alerts);

router.get("/", authController.isLoggedIn, viewsController.getHome);

router.get(
  "/product/:slug",
  authController.isLoggedIn,
  viewsController.getProduct
);

router.get("/auth", authController.isLoggedIn, viewsController.getLoginForm);

router.get("/auth", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/reset", viewsController.resetForm);
router.get("/forget", viewsController.forgetForm);

router.get("/profile", authController.isLoggedIn, viewsController.getAccount);

router.get("/soon", authController.isLoggedIn, viewsController.commingSoon);

router.post(
  "/submit-user-data",
  authController.isLoggedIn,
  viewsController.updateUserData
);

router.post("/", authController.protect, viewsController.recieveEmail);

module.exports = router;
