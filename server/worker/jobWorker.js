require("dotenv").config();
const connectDB = require("../config/db");
const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const Redis = require("ioredis");

// console.log("Worker starting...");
connectDB();

const pub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  "job-import-queue",
  async (job) => {
    // console.log("Processing job:", job.data.fileName);

    const { fileName, jobs } = job.data;
    let newJobs = 0,
      updatedJobs = 0,
      failedJobs = 0,
      failedReasons = [];

    for (const item of jobs) {
      try {
        const exists = await Job.findOne({ jobId: item.id });

        if (exists) {
          await Job.updateOne({ jobId: item.id }, item);
          updatedJobs++;
        } else {
          await Job.create({ jobId: item.id, ...item });
          newJobs++;
        }
      } catch (err) {
        failedJobs++;
        failedReasons.push(err.message);
      }
    }

    const log = await ImportLog.create({
      fileName,
      timestamp: new Date(),
      totalFetched: jobs.length,
      newJobs,
      updatedJobs,
      failedJobs,
      failedReasons,
    });

    pub.publish("new-import-log", JSON.stringify(log));

    // console.log("Log published to Redis");
    return true;
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Job failed:", err);
});
