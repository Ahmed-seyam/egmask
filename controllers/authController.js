const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const authFactory = require("./authFactory");
const Promoter = require("./../models/promotersModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Sign Up As User
exports.signup = catchAsync(async (req, res, next) => {
  if (req.file) req.photo = req.file.filename;
  if (await Promoter.findOne({ email: req.body.email })) {
    return next(new AppError("Use another email", 400));
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phoneNumber: req.body.phoneNumber,
    photo: req.photo
  });
  //  const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();
  authFactory.createSendToken(newUser, 201, res, req);
});

// Sign Up As Promoter
exports.signupAsPromoter = catchAsync(async (req, res, next) => {
  if (req.file) req.photo = req.file.filename;
  console.log(req.body);
  if (await User.findOne({ email: req.body.email })) {
    return next(new AppError("Use another email", 400));
  }
  const newPromoter = await Promoter.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phoneNumber: req.body.phoneNumber,
    photo: req.photo,
    locations: req.body.locations,
    products: req.body.products
  });
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newPromoter, url).sendWelcome();
  authFactory.createSendToken(newPromoter, 201, res, req);
});

exports.login = catchAsync(async (req, res, next) => {
  // login route
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  const promoter = await Promoter.findOne({ email }).select("+password");

  if (!promoter && !user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (promoter) {
    if (!(await promoter.correctPassword(password, promoter.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    return authFactory.createSendToken(promoter, 200, res, req);
  }

  if (user) {
    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    return authFactory.createSendToken(user, 200, res, req);
  }

  // 3) If everything ok, send token to client
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  const currentPromoter = await Promoter.findById(decoded.id);

  if (!currentUser && !currentPromoter) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser) {
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    return next();
  }

  if (currentPromoter) {
    if (currentPromoter.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
    req.user = currentPromoter;
    res.locals.user = currentPromoter;
    return next();
  }

  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  // if (req.cookies.jwt) {
  try {
    // 1) verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    const currentPromoter = await Promoter.findById(decoded.id);

    if (!currentUser && !currentPromoter) {
      return next();
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser) {
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    }

    if (currentPromoter) {
      if (currentPromoter.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      req.user = currentPromoter;
      res.locals.user = currentPromoter;
      return next();
    }
    // THERE IS A LOGGED IN USER
  } catch (err) {
    return next();
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ status: "success" });
};

exports.checkIsUserExist = (req, res, next) => {
  if (req.cookies.jwt) {
    return next(new AppError("Please Try Again Later", 404));
  }
  next();
};

exports.checkNoUserExist = (req, res, next) => {
  if (!req.cookies.auth && req.cookies.jwt) {
    return next();
  }
  if (!req.cookies.jwt && req.cookies.auth) {
    return next();
  }
  return next(new AppError("Please Try Again Later", 404));
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.pleaseLogIn = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Please Log In First", 403));
  }
  next();
};

exports.forgotPassword = authFactory.forgotPassword(User);
exports.forgotPasswordPromoter = authFactory.forgotPassword(Promoter);
exports.resetPassword = authFactory.resetPassword(User);
exports.resetPasswordPromoter = authFactory.resetPassword(Promoter);
exports.updatePassword = authFactory.updatePassword(User);
exports.updatePasswordPromoter = authFactory.updatePassword(Promoter);
