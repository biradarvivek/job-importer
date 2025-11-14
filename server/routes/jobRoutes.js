const express = require("express");
const { importJobs, getHistory } = require("../controllers/jobController");

const router = express.Router();

router.get("/import", importJobs);
router.get("/history", getHistory);

module.exports = router;
