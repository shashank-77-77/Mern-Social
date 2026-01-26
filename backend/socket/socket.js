import http from "http";
import { Server } from "socket.io";

const userSocketMap = {};

export const initSocket = (app) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "https://mern-social-frontend-s25k.onrender.com",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    });
  });

  // 👇 attach io to app (this is the key)
  app.set("io", io);

  return server;
};

export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
