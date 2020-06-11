const Promoter = require("./../models/promotersModel");
const factory = require("./handlerFactory");
const multerController = require("./multerController");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.uploadPromoterPhoto = multerController.uploadPhoto;
exports.resizePromoterPhoto = multerController.resizePhoto("promoter", 50, 50);
exports.getPromoter = factory.getOne(Promoter);
exports.getAllPromoters = factory.getAll(Promoter);
exports.CreatePromoter = factory.createOne(Promoter);
exports.updatePromoter = factory.updateOne(Promoter);

exports.deletePromoter = catchAsync(async (req, res, next) => {
  const doc = await Promoter.findOneAndDelete({ email: req.body.email });

  if (!doc) {
    return next(new AppError("No document found with that email", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});
