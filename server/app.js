const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const startupRoutes = require("./routes/startupRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(startupRoutes());
app.use(healthRoutes);

module.exports = app;
