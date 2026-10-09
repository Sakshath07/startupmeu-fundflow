const express = require("express");
const { getRootStatus, getHealthStatus } = require("../controllers/healthController");

const router = express.Router();

router.get("/", getRootStatus);
router.get("/api/health", getHealthStatus);

module.exports = router;
