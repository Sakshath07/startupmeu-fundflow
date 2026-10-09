require("dotenv").config();

const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const Startup = require("../models/Startup");

const demoStartups = [
  {
    name: "Canopy",
    industry: "Climate",
    description: "Turning overlooked food waste into the next generation of sustainable materials.",
    fundingGoal: 1200000,
    amountRaised: 780000,
    stage: "Seed",
  },
  {
    name: "Northstar Health",
    industry: "Healthtech",
    description: "Making specialist care easier to reach with a smarter virtual-first clinic.",
    fundingGoal: 900000,
    amountRaised: 603000,
    stage: "Pre-seed",
  },
  {
    name: "Parcel",
    industry: "Logistics",
    description: "A cleaner, faster last-mile network built for independent retailers.",
    fundingGoal: 1500000,
    amountRaised: 975000,
    stage: "Seed",
  },
  {
    name: "Morrow",
    industry: "Fintech",
    description: "Cash-flow tools helping small businesses plan with confidence.",
    fundingGoal: 800000,
    amountRaised: 416000,
    stage: "Pre-seed",
  },
  {
    name: "Fieldnote",
    industry: "Education",
    description: "Project-based learning that helps young people build real-world skills.",
    fundingGoal: 650000,
    amountRaised: 487500,
    stage: "Seed",
  },
  {
    name: "Goodkind",
    industry: "Consumer",
    description: "Everyday personal care with thoughtful ingredients and less packaging.",
    fundingGoal: 1000000,
    amountRaised: 530000,
    stage: "Seed",
  },
];

async function seedStartups() {
  await connectDatabase();

  const result = await Startup.bulkWrite(
    demoStartups.map((startup) => ({
      updateOne: {
        filter: { name: startup.name },
        update: { $setOnInsert: startup },
        upsert: true,
      },
    })),
    { ordered: true },
  );

  console.log(
    `Demo startup seed complete: ${result.upsertedCount} inserted, existing records left unchanged.`,
  );
}

seedStartups()
  .catch(() => {
    console.error("Demo startup seeding failed. Check MongoDB configuration and availability.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
