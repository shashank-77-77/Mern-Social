import React from "react";

const Message = ({ ownMessage, message }) => {
  if (!message) return null;

  return (
    <div
      className={`mb-2 flex ${
        ownMessage ? "justify-end" : "justify-start"
      }`}
    >
      <span
        className={`max-w-[70%] break-words p-2 rounded-lg text-sm ${
          ownMessage
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-black"
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default Message;
