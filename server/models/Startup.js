const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fundingGoal: {
      type: Number,
      required: true,
      min: 0,
    },
    amountRaised: {
      type: Number,
      required: true,
      min: 0,
    },
    stage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, result) {
        result.id = result._id.toString();
        delete result._id;
        delete result.__v;
        return result;
      },
    },
  },
);

module.exports = mongoose.model("Startup", startupSchema);
