const express = require("express");
const Startup = require("../models/Startup");
const InvestorInterest = require("../models/InvestorInterest");
const createStartupController = require("../controllers/startupController");
const createInvestorInterestController = require("../controllers/investorInterestController");

function createStartupRouter(
  model = Startup,
  interestModel = InvestorInterest,
) {
  const router = express.Router();
  router.get("/api/startups", createStartupController(model));
  router.post(
    "/api/startups/:startupId/interests",
    createInvestorInterestController({
      Startup: model,
      InvestorInterest: interestModel,
    }),
  );
  return router;
}

module.exports = createStartupRouter;
