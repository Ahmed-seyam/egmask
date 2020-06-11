const mongoose = require("mongoose");
const validator = require("validator");

const promoterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide the phone number "]
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Promoter must belong to a Product."]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Promoter = mongoose.model("Promoter", promoterSchema);

module.exports = Promoter;
