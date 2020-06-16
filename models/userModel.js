const mongoose = require("mongoose");
const validator = require("validator");
const passwordFactory = require("./passwordFactory");

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
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
  phoneNumber: {
    type: Number,
    required: true
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

passwordFactory.hashPassword(userSchema);
passwordFactory.passwordIsModified(userSchema);
passwordFactory.selectActivePersons(userSchema);
passwordFactory.passwordIsCorrect(userSchema);
passwordFactory.changedPassAfter(userSchema);
passwordFactory.createPassResetToken(userSchema);

const User = mongoose.model("User", userSchema);

module.exports = User;
