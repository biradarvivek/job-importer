const mongoose = require("mongoose");

const importLogSchema = new mongoose.Schema({
  fileName: String,
  timestamp: Date,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: Number,
  failedReasons: Array,
});

module.exports = mongoose.model("ImportLog", importLogSchema);
