import React, { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatData } from "../../context/ChatContext";
import { UserData } from "../../context/UserContext";

const MessageInput = ({ setMessages, selectedChat }) => {
  const { user } = UserData();
  const { setChats } = ChatData();

  const [textMsg, setTextMsg] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ LOCK receiver ONCE per chat
  const receiverId = useMemo(() => {
    return selectedChat.users.find(
      (u) => u._id !== user._id
    )?._id;
  }, [selectedChat, user._id]);

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!textMsg.trim() || sending || !receiverId) return;

    try {
      setSending(true);

      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        recieverId: receiverId,
      });

      setMessages((prev) => [...prev, data]);

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                latestMessage: {
                  text: textMsg,
                  sender: data.sender,
                },
              }
            : chat
        )
      );

      setTextMsg("");
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleMessage}
      className="flex items-center gap-2 p-3 border-t bg-white"
    >
      <input
        value={textMsg}
        onChange={(e) => setTextMsg(e.target.value)}
        placeholder="Type a message…"
        className="flex-1 px-4 py-2 rounded-full bg-gray-100"
        disabled={sending}
      />

      <button
        type="submit"
        disabled={sending || !textMsg.trim()}
        className="bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
