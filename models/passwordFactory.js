const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.hashPassword = schema =>
  schema.pre("save", async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

exports.passwordIsModified = schema =>
  schema.pre("save", function(next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

exports.selectActivePersons = schema =>
  schema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
  });

exports.passwordIsCorrect = schema => {
  schema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
};

exports.changedPassAfter = schema => {
  schema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );

      return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
  };
};

exports.createPassResetToken = schema => {
  schema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };
};
