import React, { useState } from "react";
import { ChatData } from "../../context/ChatContext";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";

const MessageInput = ({ selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const { sendMessage } = ChatData();
  const { user } = UserData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textMsg.trim()) return;

    // find the other user safely
    const receiver = selectedChat.users.find(
      (u) => u._id !== user._id
    );

    if (!receiver) {
      toast.error("Unable to send message");
      return;
    }

    try {
      await sendMessage(receiver._id, textMsg);
      setTextMsg("");
    } catch {
      toast.error("Message failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Type a message"
        className="border border-gray-300 rounded-lg p-2 flex-1"
        value={textMsg}
        onChange={(e) => setTextMsg(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 rounded-lg"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
