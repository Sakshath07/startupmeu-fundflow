const express = require("express");
const Startup = require("../models/Startup");
const createStartupController = require("../controllers/startupController");

function createStartupRouter(model = Startup) {
  const router = express.Router();
  router.get("/api/startups", createStartupController(model));
  return router;
}

module.exports = createStartupRouter;
