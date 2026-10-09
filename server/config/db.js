const mongoose = require("mongoose");

function validateMongoUri(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI must be configured before connecting to MongoDB.");
  }

  let parsedUri;
  try {
    parsedUri = new URL(uri);
  } catch {
    throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
  }

  if (
    !["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol) ||
    !parsedUri.hostname
  ) {
    throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
  }
}

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  validateMongoUri(uri);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch {
    throw new Error("MongoDB connection failed. Check MONGODB_URI and database availability.");
  }
}

module.exports = connectDatabase;
