const assert = require("node:assert/strict");
const express = require("express");
const { test } = require("node:test");
const createStartupRouter = require("../routes/startupRoutes");

const sampleStartup = {
  _id: { toString: () => "startup-1" },
  name: "Canopy",
  industry: "Climate",
  description: "Sustainable materials from food waste.",
  fundingGoal: 1200000,
  amountRaised: 780000,
  stage: "Seed",
};

async function requestStartups(model, query = "") {
  const app = express();
  app.use(createStartupRouter(model));
  const server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/startups${query}`,
    );
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function fakeModel({ records = [sampleStartup], failure } = {}) {
  const calls = [];
  const model = {
    find(filter) {
      calls.push(filter);
      return {
        select() {
          return this;
        },
        sort() {
          return this;
        },
        lean() {
          return failure ? Promise.reject(failure) : Promise.resolve(records);
        },
      };
    },
  };

  return { model, calls };
}

test("GET /api/startups returns startup cards in the API envelope", async () => {
  const { model, calls } = fakeModel();
  const result = await requestStartups(model);

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    data: [{
      id: "startup-1",
      name: "Canopy",
      industry: "Climate",
      description: "Sustainable materials from food waste.",
      fundingGoal: 1200000,
      amountRaised: 780000,
      stage: "Seed",
    }],
  });
  assert.deepEqual(calls[0], {});
});

test("search matches startup fields with escaped, case-insensitive text", async () => {
  const { model, calls } = fakeModel({ records: [] });
  const result = await requestStartups(model, "?search=Canopy.%2A");

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { data: [] });
  assert.deepEqual(calls[0].$or.map(({ name, industry, description }) => (
    [name, industry, description].some((pattern) => (
      pattern instanceof RegExp &&
      pattern.source === "Canopy\\.\\*" &&
      pattern.flags.includes("i")
    ))
  )), [true, true, true]);
});

test("industry filter is an exact case-insensitive match", async () => {
  const { model, calls } = fakeModel({ records: [] });
  await requestStartups(model, "?industry=climate");

  assert.equal(calls[0].industry.source, "^climate$");
  assert.ok(calls[0].industry.flags.includes("i"));
});

test("search and industry filters are combined", async () => {
  const { model, calls } = fakeModel({ records: [] });
  await requestStartups(model, "?search=materials&industry=Climate");

  assert.equal(calls[0].$or.length, 3);
  assert.equal(calls[0].industry.source, "^Climate$");
});

test("no matches returns an empty data array", async () => {
  const { model } = fakeModel({ records: [] });
  const result = await requestStartups(model, "?search=missing");

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { data: [] });
});

test("database errors return a safe error response", async () => {
  const { model } = fakeModel({
    failure: new Error("database failure containing a private connection URI"),
  });
  const result = await requestStartups(model);

  assert.equal(result.status, 500);
  assert.deepEqual(result.body, {
    error: { message: "Unable to load startups." },
  });
  assert.ok(!JSON.stringify(result.body).includes("private connection URI"));
});

test("overlong filters are rejected before querying the model", async () => {
  const { model, calls } = fakeModel();
  const result = await requestStartups(model, `?search=${"x".repeat(101)}`);

  assert.equal(result.status, 400);
  assert.deepEqual(calls, []);
});
