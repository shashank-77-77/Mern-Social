import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { ChatData } from "../../context/ChatContext";
import { UserData } from "../../context/UserContext";
import { SocketData } from "../../context/SocketContext";

const MessageInput = ({ setMessages, selectedChat }) => {
  const { user } = UserData();
  const { setChats } = ChatData();
  const { socket } = SocketData();

  const [textMsg, setTextMsg] = useState("");
  const [sending, setSending] = useState(false);

  /* ===============================
     LOCK RECEIVER (STABLE)
     =============================== */
  const receiverId = useMemo(() => {
    return selectedChat.users.find(
      (u) => u._id !== user._id
    )?._id;
  }, [selectedChat, user._id]);

  /* ===============================
     TYPING INDICATOR (UNCHANGED)
     =============================== */
  const typingRef = useRef(false);
  const timerRef = useRef(null);

  const handleTyping = (e) => {
    setTextMsg(e.target.value);

    if (!socket || !selectedChat?._id) return;

    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit("typing", { chatId: selectedChat._id });
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      typingRef.current = false;
      socket.emit("stopTyping", { chatId: selectedChat._id });
    }, 1200);
  };

  /* ===============================
     SEND MESSAGE (OPTIMISTIC)
     =============================== */
  const handleMessage = async (e) => {
    e.preventDefault();

    if (!textMsg.trim() || sending || !receiverId) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      chatId: selectedChat._id,
      sender: user._id,
      text: textMsg,
      sending: true,
      failed: false,
      createdAt: new Date().toISOString(),
    };

    // 1️⃣ Optimistic UI injection
    setMessages((prev) => [...prev, optimisticMessage]);
    setTextMsg("");
    setSending(true);

    try {
      const { data } = await axios.post("/api/messages", {
        message: optimisticMessage.text,
        recieverId: receiverId,
      });

      // 2️⃣ Replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? data : msg
        )
      );

      // 3️⃣ Update chat preview (NO LOGIC CHANGE)
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                latestMessage: {
                  text: data.text,
                  sender: data.sender,
                },
              }
            : chat
        )
      );

      socket?.emit("stopTyping", { chatId: selectedChat._id });
      typingRef.current = false;
    } catch (err) {
      // 4️⃣ Mark optimistic message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...msg, sending: false, failed: true }
            : msg
        )
      );

      toast.error("Message failed to send");
    } finally {
      setSending(false);
    }
  };

  /* ===============================
     CLEANUP ON CHAT SWITCH
     =============================== */
  useEffect(() => {
    setTextMsg("");
    typingRef.current = false;
    clearTimeout(timerRef.current);
  }, [selectedChat?._id]);

  return (
    <form
      onSubmit={handleMessage}
      className="flex items-center gap-2 p-3 border-t bg-white"
    >
      <input
        value={textMsg}
        onChange={handleTyping}
        placeholder="Type a message…"
        className="
          flex-1
          px-4 py-2
          rounded-full
          bg-gray-100
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400
          transition
        "
        disabled={sending}
      />

      <button
        type="submit"
        disabled={sending || !textMsg.trim()}
        className="
          bg-blue-600
          text-white
          px-5 py-2
          rounded-full
          font-medium
          hover:bg-blue-700
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
