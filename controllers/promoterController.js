const Promoter = require("./../models/promotersModel");
const factory = require("./handlerFactory");
const multerController = require("./multerController");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const authFactory = require("./authFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.uploadPromoterPhoto = multerController.uploadPhoto;
exports.resizePromoterPhoto = multerController.resizePhoto("promoter", 50, 50);
exports.getPromoter = factory.getOne(Promoter);
exports.getAllPromoters = factory.getAll(Promoter);
exports.updatePromoter = factory.updateOne(Promoter);
exports.deleteMePromoter = authFactory.deleteMe(Promoter);
exports.updateMePromoter = authFactory.updateMe(
  Promoter,
  "name",
  "email",
  "phoneNumber"
);
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

exports.updateLocations = catchAsync(async (req, res, next) => {
  const location = await Promoter.update(
    { "locations._id": req.body.locationId },
    {
      $set: {
        "locations.$.coordinates": req.body.newLocation.coordinates,
        "locations.$.address": req.body.newLocation.address
      }
    }
  );
  res.status(200).json({
    status: "success",
    data: location
  });
});

exports.addLocations = catchAsync(async (req, res, next) => {
  const location = await Promoter.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: {
        locations: req.body.newLocation
      }
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: location
  });
});

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const location = await Promoter.update(
    { _id: req.user.id },
    {
      $pull: { locations: { _id: req.body.locationId } }
    },
    { multi: true }
  );
  res.status(200).json({
    status: "success",
    data: location
  });
});

// Dive.update({ _id: diveId }, { "$pull": { "divers": { "user": userIdToRemove } }}, { safe: true, multi:true }, function(err, obj) {
exports.updateProducts = catchAsync(async (req, res, next) => {
  const product = await Promoter.findByIdAndUpdate(
    req.user.id,
    {
      products: req.body.products
    },
    {
      new: true,
      runValidators: true,
      multi: true
    }
  );

  res.status(200).json({
    status: "success",
    data: product
  });
});
