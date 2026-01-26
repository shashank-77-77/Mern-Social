import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";
import { SocketData } from "../context/SocketContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const ChatPage = ({ user }) => {
  const { chats, selectedChat, setSelectedChat, fetchChats, sendMessage } =
    ChatData();

  const { onlineUsers } = SocketData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);

  /* ---------- Search Users ---------- */
  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get(`/api/user/all?search=${query}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (search) fetchAllUsers();
  }, [query, search]);

  /* ---------- Init Chats ---------- */
  useEffect(() => {
    fetchChats();
  }, []);

  /* ---------- Start New Chat ---------- */
  const startChat = async (receiverId) => {
    await sendMessage(receiverId, "👋");
    setSearch(false);
    fetchChats();
  };

  /* ---------- Helper ---------- */
  const isUserOnline = (chat) => {
    const otherUser = chat.users.find((u) => u._id !== user._id);
    return otherUser && onlineUsers.includes(otherUser._id);
  };

  return (
    <div className="w-full md:w-[750px] md:p-4">
      <div className="flex gap-4 mx-auto">
        {/* Sidebar */}
        <div className="w-[30%]">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-full"
            onClick={() => setSearch((prev) => !prev)}
          >
            {search ? "X" : <FaSearch />}
          </button>

          {search ? (
            <>
              <input
                type="text"
                className="custom-input mt-2"
                placeholder="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="users">
                {users.length ? (
                  users.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => startChat(u._id)}
                      className="bg-gray-500 text-white p-2 mt-2 cursor-pointer flex items-center gap-2"
                    >
                      <img
                        src={u.profilePic?.url}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      {u.name}
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-sm">No users found</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col mt-2">
              {chats.map((chat) => (
                <Chat
                  key={chat._id}
                  chat={chat}
                  setSelectedChat={setSelectedChat}
                  isOnline={isUserOnline(chat)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="w-[70%]">
            <MessageContainer selectedChat={selectedChat} />
          </div>
        ) : (
          <div className="w-[70%] mx-20 mt-40 text-xl">
            Hello 👋 {user.name}, select a chat to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
