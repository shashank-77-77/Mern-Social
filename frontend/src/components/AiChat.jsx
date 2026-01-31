import React, { useState } from "react";
import axios from "axios";

/* =========================================================
   AI CHAT — GLASS / SMART COPILOT
   (Backend contract unchanged)
========================================================= */

const AiChat = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setReply("");

    try {
      const { data } = await axios.post(
        "/api/ai/chat",
        { message },
        { withCredentials: true }
      );

      setReply(data.reply || "No response from AI.");
    } catch {
      setReply("⚠️ AI is unavailable right now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          🤖 AI Copilot
        </h3>
        {loading && (
          <span className="text-xs text-cyan-400 animate-pulse">
            Thinking…
          </span>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything… (posts, ideas, captions)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="custom-input flex-1"
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className="btn-primary px-4"
        >
          Ask
        </button>
      </div>

      {/* AI Reply */}
      {reply && (
        <div className="relative mt-2 p-3 rounded-xl bg-black/30 text-sm text-gray-100 leading-relaxed">
          <span className="absolute -top-2 left-3 text-xs bg-cyan-500 text-black px-2 py-[2px] rounded-full">
            AI
          </span>
          {reply}
        </div>
      )}
    </div>
  );
};

export default AiChat;
