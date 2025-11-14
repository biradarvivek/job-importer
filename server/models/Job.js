const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: String,
    title: String,
    company: String,
    description: String,
    link: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
