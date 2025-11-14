const cron = require("node-cron");
const axios = require("axios");

cron.schedule("*0 * * * *", async () => {
  try {
    await axios.get(process.env.API_BASE + "/api/jobs/import");
    // console.log("Cron Job Ran");
  } catch (err) {
    console.log("Cron error:", err.message);
  }
});
