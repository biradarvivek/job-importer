const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
require("./cron/fetchCron");

const http = require("http");
const { initSocket, getIO } = require("./socket");
const Redis = require("ioredis");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => res.send("API Running"));

connectDB();

const server = http.createServer(app);

initSocket(server);

const sub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

sub.subscribe("new-import-log", (err) => {
  if (err) {
    console.log("Redis Subscribe Error:", err);
  } else {
    console.log("Subscribed to new-import-log");
  }
});

sub.on("message", (channel, message) => {
  if (channel === "new-import-log") {
    const log = JSON.parse(message);

    // console.log("Redis message received:", log.fileName);

    const io = getIO();
    io.emit("new-import-log", log);

    // console.log("Log emitted to frontend");
  }
});

server.listen(process.env.PORT, () =>
  console.log("Server running on PORT " + process.env.PORT)
);
