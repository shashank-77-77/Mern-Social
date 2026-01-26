import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../context/UserContext";
import { SocketData } from "../../context/SocketContext";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const MessageContainer = ({ selectedChat }) => {
  const { user } = UserData();
  const { socket } = SocketData();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  /* ---------- Fetch Messages ---------- */
  const fetchMessages = async () => {
    if (!selectedChat?._id) return;

    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/messages/chat/${selectedChat._id}`
      );
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Initial Load / Chat Switch ---------- */
  useEffect(() => {
    fetchMessages();
  }, [selectedChat?._id]);

  /* ---------- Socket Listener ---------- */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload) => {
      if (payload.chatId !== selectedChat?._id) return;

      setMessages((prev) => [...prev, payload.message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChat?._id]);

  /* ---------- Auto Scroll ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Helpers ---------- */
  const otherUser = selectedChat.users.find(
    (u) => u._id !== user._id
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 h-12">
        <img
          src={otherUser?.profilePic?.url}
          className="w-8 h-8 rounded-full"
          alt=""
        />
        <span>{otherUser?.name}</span>
      </div>

      {/* Messages */}
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3">
            {messages.map((m) => (
              <Message
                key={m._id}
                message={m.text}
                ownMessage={m.sender === user._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <MessageInput
            selectedChat={selectedChat}
            setMessages={setMessages}
          />
        </>
      )}
    </div>
  );
};

export default MessageContainer;
