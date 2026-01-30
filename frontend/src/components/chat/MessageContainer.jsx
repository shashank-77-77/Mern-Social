import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { UserData } from "../../context/UserContext";
import { SocketData } from "../../context/SocketContext";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";

const MessageContainer = ({ selectedChat, setChats }) => {
  const { user } = UserData();
  const { socket } = SocketData();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  /* =========================================================
     STABLE DERIVED STATE — OTHER USER (SINGLE SOURCE OF TRUTH)
     ========================================================= */
  const otherUser = useMemo(() => {
    if (!selectedChat || !user) return null;
    return selectedChat.users.find(
      (u) => u._id !== user._id
    );
  }, [selectedChat, user]);

  /* =========================================================
     FETCH MESSAGES (SAFE + GUARDED)
     ========================================================= */
  useEffect(() => {
    if (!otherUser || !selectedChat) return;

    let isActive = true; // prevents race conditions

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/messages/${otherUser._id}`
        );

        if (isActive) {
          setMessages(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isActive = false;
    };
  }, [otherUser, selectedChat]);

  /* =========================================================
     SOCKET: NEW MESSAGE HANDLING (CHAT-SCOPED)
     ========================================================= */
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handler = (message) => {
      if (message.chatId !== selectedChat._id) return;

      setMessages((prev) => [...prev, message]);

      setChats((prev) =>
        prev.map((c) =>
          c._id === message.chatId
            ? {
                ...c,
                latestMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              }
            : c
        )
      );
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedChat, setChats]);

  /* =========================================================
     AUTO SCROLL
     ========================================================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================================================
     GUARD — CHAT NOT READY
     ========================================================= */
  if (!selectedChat || !otherUser) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <img
          src={otherUser.profilePic.url}
          alt={otherUser.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold">
          {otherUser.name}
        </span>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Message
                key={msg._id}
                message={msg.text}
                ownMessage={
                  msg.sender === user._id ||
                  msg.sender?._id === user._id
                }
              />
            ))
          ) : (
            <div className="text-center text-sm text-gray-400 mt-6">
              No messages yet. Say hi 👋
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      {/* Input */}
      <MessageInput
        setMessages={setMessages}
        selectedChat={selectedChat}
      />
    </div>
  );
};

export default MessageContainer;
