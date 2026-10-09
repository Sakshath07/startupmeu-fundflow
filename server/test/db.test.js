const assert = require("node:assert/strict");
const { test } = require("node:test");
const connectDatabase = require("../config/db");

test("missing MONGODB_URI fails before a database connection", async () => {
  const originalUri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;

  try {
    await assert.rejects(
      connectDatabase(),
      /MONGODB_URI must be configured before connecting to MongoDB/,
    );
  } finally {
    if (originalUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalUri;
    }
  }
});

test("malformed MONGODB_URI fails before a database connection without exposing it", async () => {
  const originalUri = process.env.MONGODB_URI;
  const malformedUri = "not-a-valid-mongodb-uri-with-secret";
  process.env.MONGODB_URI = malformedUri;

  try {
    await assert.rejects(connectDatabase(), (error) => {
      assert.match(error.message, /MONGODB_URI must be a valid MongoDB connection string/);
      assert.ok(!error.message.includes(malformedUri));
      return true;
    });
  } finally {
    if (originalUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalUri;
    }
  }
});
