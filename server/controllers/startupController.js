const MAX_SEARCH_LENGTH = 100;
const MAX_INDUSTRY_LENGTH = 80;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createStartupController(Startup) {
  return async function getStartups(req, res) {
    const { search, industry } = req.query;

    if (
      (search !== undefined && typeof search !== "string") ||
      (industry !== undefined && typeof industry !== "string")
    ) {
      return res.status(400).json({
        error: { message: "Search and industry filters must be text values." },
      });
    }

    const normalizedSearch = search?.trim() ?? "";
    const normalizedIndustry = industry?.trim() ?? "";

    if (
      normalizedSearch.length > MAX_SEARCH_LENGTH ||
      normalizedIndustry.length > MAX_INDUSTRY_LENGTH
    ) {
      return res.status(400).json({
        error: { message: "Search or industry filter is too long." },
      });
    }

    const filter = {};
    if (normalizedSearch) {
      const searchPattern = new RegExp(escapeRegex(normalizedSearch), "i");
      filter.$or = [
        { name: searchPattern },
        { industry: searchPattern },
        { description: searchPattern },
      ];
    }
    if (normalizedIndustry) {
      filter.industry = new RegExp(`^${escapeRegex(normalizedIndustry)}$`, "i");
    }

    try {
      const startups = await Startup.find(filter)
        .select("name industry description fundingGoal amountRaised stage")
        .sort({ name: 1 })
        .lean();

      return res.json({
        data: startups.map((startup) => ({
          id: startup._id.toString(),
          name: startup.name,
          industry: startup.industry,
          description: startup.description,
          fundingGoal: startup.fundingGoal,
          amountRaised: startup.amountRaised,
          stage: startup.stage,
        })),
      });
    } catch {
      return res.status(500).json({
        error: { message: "Unable to load startups." },
      });
    }
  };
}

module.exports = createStartupController;
