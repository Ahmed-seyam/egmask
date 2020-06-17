const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");
const Promoter = require("./../models/promotersModel");
const User = require("./../models/userModel");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers("x-forwarded-proto") === "https"
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

// Protect Function

const forgotPassword = (Model1, Model2) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await Model1.findOne({ email: req.body.email });
    const promoter = await Model2.findOne({ email: req.body.email });
    if (!user && !promoter) {
      return next(new AppError("Something went wrong", 404));
    }
    let email;
    if (user) {
      email = user;
    }
    if (promoter) {
      email = promoter;
    }
    // 2) Generate the random reset token
    const resetToken = email.createPasswordResetToken();
    await email.save({ validateBeforeSave: false });

    // 3) Send it to user's email

    try {
      console.log(resetToken);
      await new Email(email, resetToken).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!"
      });
    } catch (err) {
      email.passwordResetToken = undefined;
      email.passwordResetExpires = undefined;
      await email.save({ validateBeforeSave: false });
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  });

const resetPassword = (Model1, Model2) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await Model1.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    const promoter = await Model2.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user && !promoter) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    let email;
    if (user) {
      email = user;
    }
    if (promoter) {
      email = promoter;
    }

    email.password = req.body.password;
    email.passwordConfirm = req.body.passwordConfirm;
    email.passwordResetToken = undefined;
    email.passwordResetExpires = undefined;
    await email.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(email, 200, res, req);
  });

const updatePassword = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await Model.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if (
      !req.body.passwordCurrent ||
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res, req);
  });
/*
    Updata Data And Delete User
  */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateMe = (Model, ...allowedFields) =>
  catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }
    if (Model === Promoter) {
      if (await User.findOne({ email: req.body.email })) {
        return next(new AppError("Use another Email", 403));
      }
    } else if (Model === User) {
      if (await Promoter.findOne({ email: req.body.email })) {
        return next(new AppError("Use another Email", 403));
      }
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, ...allowedFields);
    if (req.file) filteredBody.photo = req.file.filename;
    // 3) Update user document
    const updatedUser = await Model.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });
  });

const deleteMe = Model =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null
    });
  });

module.exports = {
  createSendToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe
};
