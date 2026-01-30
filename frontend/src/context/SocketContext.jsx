import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserData } from "./UserContext";

/* =========================================================
   SOCKET CONTEXT
========================================================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { user } = UserData();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 🔹 typing state: { [chatId]: true }
  const [typingChats, setTypingChats] = useState({});

  useEffect(() => {
    if (!user?._id) return;

    const socketInstance = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketInstance);

    /* ===============================
       CONNECTION
       =============================== */
    socketInstance.on("connect", () => {
      console.log("🟢 Socket connected:", socketInstance.id);
      socketInstance.emit("addUser", user._id);
    });

    /* ===============================
       ONLINE USERS
       =============================== */
    socketInstance.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    /* ===============================
       TYPING INDICATOR
       =============================== */
    socketInstance.on("typing", ({ chatId }) => {
      setTypingChats((prev) => ({ ...prev, [chatId]: true }));
    });

    socketInstance.on("stopTyping", ({ chatId }) => {
      setTypingChats((prev) => {
        const copy = { ...prev };
        delete copy[chatId];
        return copy;
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setOnlineUsers([]);
      setTypingChats({});
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingChats,
        setTypingChats,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
