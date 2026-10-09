require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/db");
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`StartupMeu server running on http://localhost:${PORT}`);
  });
}

startServer().catch(() => {
  console.error("Server startup failed. Check server configuration and MongoDB availability.");
  process.exitCode = 1;
});