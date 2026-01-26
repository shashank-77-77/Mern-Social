import http from "http";
import { Server } from "socket.io";

/* =========================
   Socket User Map
   ========================= */
const userSocketMap = {};

/* =========================
   Init Socket
   ========================= */
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
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId) delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    });
  });

  // expose io globally
  app.set("io", io);

  return server;
};

/* =========================
   Helper Exports
   ========================= */
export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
//