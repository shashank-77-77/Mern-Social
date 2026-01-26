import React from "react";
import { UserData } from "../../context/UserContext";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();

  if (!chat) return null;

  // safely find the other user
  const otherUser = chat.users.find(
    (u) => u._id !== loggedInUser._id
  );

  const latestMessage = chat.latestMessage;
  const isSender =
    latestMessage &&
    (latestMessage.sender === loggedInUser._id ||
      latestMessage.sender?._id === loggedInUser._id);

  return (
    <div
      className="bg-gray-200 py-2 px-2 rounded-md cursor-pointer mt-3 hover:bg-gray-300"
      onClick={() => setSelectedChat(chat)}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={otherUser?.profilePic?.url}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white" />
          )}
        </div>
        <span className="font-medium">{otherUser?.name}</span>
      </div>

      {latestMessage && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          {isSender && <BsSendCheck />}
          <span>
            {latestMessage.text.length > 18
              ? latestMessage.text.slice(0, 18) + "…"
              : latestMessage.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default Chat;
