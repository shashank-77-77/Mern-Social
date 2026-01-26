import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { UserData } from "./UserContext";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { user, isAuth } = UserData();
  const socketRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // ❗ Do not connect until user is authenticated
    if (!isAuth || !user?._id) return;

    // Prevent duplicate connections (StrictMode safe)
    if (socketRef.current) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      query: {
        userId: user._id,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setOnlineUsers([]);
    });

    return () => {
      socket.off("getOnlineUser");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuth, user?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
