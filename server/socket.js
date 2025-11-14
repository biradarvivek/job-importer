const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis");

let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  // Redis pub/sub
  const pub = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
  const sub = pub.duplicate();

  io.adapter(createAdapter(pub, sub));

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };
