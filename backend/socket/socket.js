import { Server } from "socket.io";
import http from "http";

let io;
const userSocketMap = {};

export const initSocket = (app) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [key, value] of Object.entries(userSocketMap)) {
        if (value === socket.id) {
          delete userSocketMap[key];
          break;
        }
      }

      io.emit("getOnlineUser", Object.keys(userSocketMap));
    });
  });

  return server;
};

export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io };
