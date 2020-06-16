const mongoose = require("mongoose");
const validator = require("validator");
const passwordFactory = require("./passwordFactory");

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
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true,
      sparse: true
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide the phone number "]
    },
    role: {
      type: String,
      enum: ["promoter", "admin"],
      default: "promoter"
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Your password must be more than 8 chars"],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm your password"],
      validate: {
        validator: function(val) {
          return val === this.password;
        },
        message: "Passwords Are Not The Same"
      }
    },
    locations: [
      {
        // GeoJSON

        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: {
          type: [Number]
        },
        address: String
      }
    ],
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
      }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

passwordFactory.hashPassword(promoterSchema);
passwordFactory.passwordIsModified(promoterSchema);
passwordFactory.selectActivePersons(promoterSchema);
passwordFactory.passwordIsCorrect(promoterSchema);
passwordFactory.changedPassAfter(promoterSchema);
passwordFactory.createPassResetToken(promoterSchema);

const Promoter = mongoose.model("Promoter", promoterSchema);

module.exports = Promoter;
