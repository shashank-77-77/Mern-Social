import React from "react";

const Message = ({ ownMessage, message }) => {
  return (
    <div
      className={`flex ${
        ownMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[70%]
          px-4 py-2
          text-sm
          rounded-2xl
          shadow-sm
          ${
            ownMessage
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }
        `}
      >
        {message}
      </div>
    </div>
  );
};

export default Message;
