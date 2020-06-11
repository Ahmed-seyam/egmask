const Covid = require("./../models/covidModel");
const factory = require("./handlerFactory");

exports.getCovid = factory.getAll(Covid);
exports.CreateCovid = factory.createOne(Covid);
exports.updateCovid = factory.updateOne(Covid);
exports.deleteCovid = factory.deleteOne(Covid);
