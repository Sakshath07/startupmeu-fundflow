const assert = require("node:assert/strict");
const express = require("express");
const { test } = require("node:test");
const createStartupRouter = require("../routes/startupRoutes");

const startupId = "64b000000000000000000001";
const startup = { _id: { toString: () => startupId } };

async function submitInterest({
  id = startupId,
  body = {
    name: "Alex Morgan",
    email: "Alex@example.test",
    message: "I would like to learn more about your startup.",
  },
  startupRecord = startup,
  lookupFailure,
  createFailure,
} = {}) {
  const creates = [];
  const startupModel = {
    findById() {
      return {
        select() {
          return this;
        },
        lean() {
          if (lookupFailure) return Promise.reject(lookupFailure);
          return Promise.resolve(startupRecord);
        },
      };
    },
  };
  const interestModel = {
    async create(document) {
      creates.push(document);
      if (createFailure) throw createFailure;
      return {
        _id: { toString: () => "interest-1" },
        ...document,
        createdAt: new Date("2026-01-01T12:00:00.000Z"),
      };
    },
  };

  const app = express();
  app.use(express.json());
  app.use(createStartupRouter(startupModel, interestModel));
  const server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/startups/${id}/interests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    return {
      status: response.status,
      body: await response.json(),
      creates,
    };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("valid interest is saved and returns a safe confirmation", async () => {
  const result = await submitInterest();

  assert.equal(result.status, 201);
  assert.deepEqual(result.creates, [{
    startup: startup._id,
    name: "Alex Morgan",
    email: "alex@example.test",
    message: "I would like to learn more about your startup.",
  }]);
  assert.deepEqual(result.body, {
    data: {
      id: "interest-1",
      startupId,
      name: "Alex Morgan",
      email: "alex@example.test",
      message: "I would like to learn more about your startup.",
      createdAt: "2026-01-01T12:00:00.000Z",
    },
  });
});

test("invalid body and field values are rejected before saving", async (t) => {
  const invalidBodies = [
    {},
    { name: "A", email: "alex@example.test", message: "Valid message text." },
    { name: "Alex Morgan", email: "not-an-email", message: "Valid message text." },
    { name: "Alex Morgan", email: "alex@example.test", message: "Short" },
    {
      name: "Alex Morgan",
      email: "alex@example.test",
      message: "x".repeat(1001),
    },
    {
      name: "Alex Morgan",
      email: "alex@example.test",
      message: "Valid message text.",
      internal: "unexpected",
    },
  ];

  for (const [index, body] of invalidBodies.entries()) {
    await t.test(`invalid request case ${index + 1}`, async () => {
      const result = await submitInterest({ body });
      assert.equal(result.status, 400);
      assert.deepEqual(result.body, {
        error: { message: "Please provide a valid name, email, and message." },
      });
      assert.deepEqual(result.creates, []);
    });
  }
});

test("invalid startup IDs are rejected before database lookup", async () => {
  const result = await submitInterest({ id: "not-an-object-id" });

  assert.equal(result.status, 400);
  assert.deepEqual(result.body, {
    error: { message: "Invalid startup ID." },
  });
  assert.deepEqual(result.creates, []);
});

test("a missing startup returns 404 without saving an interest", async () => {
  const result = await submitInterest({ startupRecord: null });

  assert.equal(result.status, 404);
  assert.deepEqual(result.body, {
    error: { message: "Startup not found." },
  });
  assert.deepEqual(result.creates, []);
});

test("startup lookup database errors return a safe 500 response", async () => {
  const result = await submitInterest({
    lookupFailure: new Error("private database connection detail"),
  });

  assert.equal(result.status, 500);
  assert.deepEqual(result.body, {
    error: { message: "Unable to submit interest." },
  });
  assert.ok(!JSON.stringify(result.body).includes("private database"));
  assert.deepEqual(result.creates, []);
});

test("interest save database errors return a safe 500 response", async () => {
  const result = await submitInterest({
    createFailure: new Error("private persistence detail"),
  });

  assert.equal(result.status, 500);
  assert.deepEqual(result.body, {
    error: { message: "Unable to submit interest." },
  });
  assert.ok(!JSON.stringify(result.body).includes("private persistence"));
  assert.equal(result.creates.length, 1);
});
