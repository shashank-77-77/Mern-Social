import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  /* ---------- Create / Open Chat ---------- */
  const createChat = async (receiverId) => {
    try {
      await axios.post("/api/messages", {
        recieverId: receiverId,
        message: "hi",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create chat"
      );
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
