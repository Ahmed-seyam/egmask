const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(viewsController.alerts);

router.get("/", authController.isLoggedIn, viewsController.getHome);
router.get("/about", authController.isLoggedIn, viewsController.getAbout);

router.get(
  "/product/:slug",
  authController.isLoggedIn,
  viewsController.getProduct
);

router.get("/auth", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signup", authController.isLoggedIn, viewsController.getSignupBtn);
router.get(
  "/signup-user",
  authController.isLoggedIn,
  viewsController.getSignupForm
);

router.get(
  "/signup-promoter",
  authController.isLoggedIn,
  viewsController.getSignupFormPromoter
);

router.get("/auth", authController.isLoggedIn, viewsController.getSignupForm);
router.get("/reset", viewsController.resetForm);
router.get("/forget", viewsController.forgetForm);

router.get("/profile-user", authController.protect, viewsController.getAccount);
router.get("/profile-admin", authController.protect, viewsController.getAdmin);
router.get(
  "/profile-promoter",
  authController.protect,
  viewsController.getPromoter
);

router.get("/soon", authController.isLoggedIn, viewsController.commingSoon);

router.post(
  "/submit-user-data",
  authController.isLoggedIn,
  viewsController.updateUserData
);

router.post("/", authController.protect, viewsController.recieveEmail);

module.exports = router;
