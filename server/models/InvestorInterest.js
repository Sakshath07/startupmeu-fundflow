const mongoose = require("mongoose");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const investorInterestSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: emailPattern,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("InvestorInterest", investorInterestSchema);
