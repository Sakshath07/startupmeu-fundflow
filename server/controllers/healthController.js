function getRootStatus(req, res) {
  res.json({
    message: "StartupMeu API is running!",
    status: "success",
  });
}

function getHealthStatus(req, res) {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getRootStatus, getHealthStatus };
