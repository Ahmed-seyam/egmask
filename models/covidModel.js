const mongoose = require("mongoose");

const covidSchema = new mongoose.Schema(
  {
    deaths: {
      type: Number,
      required: [true, "covid must have a deaths"]
    },
    recoveries: {
      type: Number,
      required: [true, "covid must have a recoveries"]
    },
    injuries: {
      type: Number,
      required: [true, "covid must have a injuries"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Covid = mongoose.model("Covid", covidSchema);
module.exports = Covid;
