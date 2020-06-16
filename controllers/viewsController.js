const Product = require("../models/productsModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Covid = require("./../models/covidModel");
const EmailRecieve = require("../utils/recieveMail");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking") {
    res.locals.alert =
      "Your Booking was successful please check your email for a confirmation.";
  }
  next();
};

exports.getHome = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const products = await Product.find();
  const covid = await Covid.findById("5ee1570d1465111ddc7aed2b");

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render("home", {
    title: "All Products",
    products,
    covid
  });
});

exports.getAbout = (req, res, next) => {
  res.status(200).render("about", {
    title: "معلومات عنا"
  });
};

exports.getProduct = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: "promoters"
  });

  if (!product) {
    return next(new AppError("There is no product with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("product", {
    title: `${product.name} Product`,
    product
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("auth", {
    title: "ادخل الي حسابك"
  });
};

exports.forgetForm = (req, res) => {
  res.status(200).render("forget", {
    title: "نسيت كلمه السر"
  });
};

exports.resetForm = (req, res) => {
  res.status(200).render("reset", {
    title: "تحديث كلمه السر"
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("authUser", {
    title: "سجل حساب"
  });
};

exports.getSignupFormPromoter = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).render("authPromoter", {
    title: "سجل حساب",
    products
  });
});

exports.getSignupBtn = (req, res) => {
  res.status(200).render("signup", {
    title: "سجل حساب"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "الصفحه الشخصيه"
  });
};
exports.getAdmin = (req, res) => {
  res.status(200).render("admin", {
    title: "الصفحه الشخصيه"
  });
};
exports.getPromoter = async (req, res) => {
  const products = await Product.find();

  res.status(200).render("promoter", {
    title: "الصفحه الشخصيه",
    products
  });
};

exports.commingSoon = (req, res) => {
  res.status(200).render("commingSoon", {
    title: "قريبا"
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser
  });
});

exports.recieveEmail = async (req, res, next) => {
  try {
    await new EmailRecieve(req.body).contactMail();
    console.log(req.body);
    res.status(200).json({
      status: "success",
      message: "message sent !"
    });
  } catch (err) {
    return next(new AppError(err, 404));
  }
};
