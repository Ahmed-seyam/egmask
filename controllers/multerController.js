const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadPhoto = upload.single("photo");

exports.resizePhoto = (type, width, height) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    console.log(req.file);
    req.file.filename = `${type}-${Math.floor(
      Math.random() * 100
    )}-${Date.now()}.jpeg`;
    console.log(req.file);

    if (type === "product") {
      req.body.photo = req.file.filename;
    }

    await sharp(req.file.buffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`./public/img/${type}s/${req.file.filename}`);

    next();
  });
