const mongoose = require("mongoose");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 1000;

function createInvestorInterestController({ Startup, InvestorInterest }) {
  return async function submitInvestorInterest(req, res) {
    const { startupId } = req.params;

    if (!mongoose.isObjectIdOrHexString(startupId)) {
      return res.status(400).json({
        error: { message: "Invalid startup ID." },
      });
    }

    const body = req.body;
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).some((key) => !["name", "email", "message"].includes(key))
    ) {
      return res.status(400).json({
        error: { message: "Please provide a valid name, email, and message." },
      });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (
      name.length < NAME_MIN_LENGTH ||
      name.length > NAME_MAX_LENGTH ||
      email.length > 254 ||
      !EMAIL_PATTERN.test(email) ||
      message.length < MESSAGE_MIN_LENGTH ||
      message.length > MESSAGE_MAX_LENGTH
    ) {
      return res.status(400).json({
        error: { message: "Please provide a valid name, email, and message." },
      });
    }

    try {
      const startup = await Startup.findById(startupId).select("_id").lean();
      if (!startup) {
        return res.status(404).json({
          error: { message: "Startup not found." },
        });
      }

      const interest = await InvestorInterest.create({
        startup: startup._id,
        name,
        email,
        message,
      });

      return res.status(201).json({
        data: {
          id: interest._id.toString(),
          startupId: startup._id.toString(),
          name: interest.name,
          email: interest.email,
          message: interest.message,
          createdAt: interest.createdAt.toISOString(),
        },
      });
    } catch {
      return res.status(500).json({
        error: { message: "Unable to submit interest." },
      });
    }
  };
}

module.exports = createInvestorInterestController;
