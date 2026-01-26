import http from "http";
import { Server } from "socket.io";

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
    console.log("Socket connected:", socket.id);
  });

  return server;
};
