const Product = require("./../models/productsModel");
const factory = require("./handlerFactory");
const multerController = require("./multerController");

exports.uploadProductPhoto = multerController.uploadPhoto;
exports.resizeProductPhoto = multerController.resizePhoto("product", 250, 250);
exports.getProduct = factory.getOne(Product, { path: "promoters" });
exports.getAllProducts = factory.getAll(Product);
exports.CreateProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
