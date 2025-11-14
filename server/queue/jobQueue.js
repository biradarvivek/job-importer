const { Queue } = require("bullmq");
const redis = require("../config/redis");

const jobQueue = new Queue("job-import-queue", {
  connection: redis,
});

module.exports = jobQueue;
