const User = require("./../models/userModel");
const factory = require("./handlerFactory");
const multerController = require("./multerController");
const authFactory = require("./authFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead"
  });
};
exports.deleteMe = authFactory.deleteMe(User);
exports.updateMe = authFactory.updateMe(User, "email", "phoneNumber", "name");
exports.uploadUserPhoto = multerController.uploadPhoto;
exports.resizeUserPhoto = multerController.resizePhoto("user", 50, 50);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
