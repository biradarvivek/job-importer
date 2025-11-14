const fetchXML = require("../services/fetchJobs");
const jobQueue = require("../queue/jobQueue");
const ImportLog = require("../models/ImportLog");

const FEED_URLS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

exports.importJobs = async (req, res) => {
  try {
    for (const url of FEED_URLS) {
      const json = await fetchXML(url);
      const items = json?.rss?.channel?.[0]?.item || [];

      const jobs = items.map((i) => ({
        id: i.guid?.[0]?._ || i.link?.[0],
        title: i.title?.[0],
        company: i["job:company"]?.[0] || "Unknown",
        description: i.description?.[0],
        link: i.link?.[0],
      }));

      await jobQueue.add("import", { fileName: url, jobs });
    }

    return res.json({ message: "Jobs added to queue" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to import jobs" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });
    return res.json(logs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};
