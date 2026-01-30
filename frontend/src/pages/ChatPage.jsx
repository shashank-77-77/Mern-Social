import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { ChatData } from "../context/ChatContext";
import { SocketData } from "../context/SocketContext";

import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import api from "../utils/axios";

const ChatPage = ({ user }) => {
  const {
    createChat,
    selectedChat,
    setSelectedChat,
    chats = [],
    setChats,
  } = ChatData();

  const { onlineUsers } = SocketData();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searching, setSearching] = useState(false);

  /* ===============================
     FETCH CHATS
     =============================== */
  useEffect(() => {
    const loadChats = async () => {
      const { data } = await api.get("/messages/chats");
      setChats(data || []);
    };
    loadChats();
  }, [setChats]);

  /* ===============================
     SEARCH USERS
     =============================== */
  const canSearch = useMemo(
    () => query.trim().length > 0 && searchMode,
    [query, searchMode]
  );

  useEffect(() => {
    if (!canSearch) {
      setUsers([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setSearching(true);
        const { data } = await api.get(
          `/user/all?search=${encodeURIComponent(query)}`
        );
        setUsers(Array.isArray(data) ? data : []);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [canSearch, query]);

  /* ===============================
     CREATE CHAT + AUTO SELECT
     =============================== */
  const createNewChat = async (userId) => {
    try {
      await createChat(userId);

      const { data } = await api.get("/messages/chats");
      setChats(data || []);

      // ✅ FIX: auto-open the correct chat
      const chatToOpen = data.find((c) =>
        c.users.some((u) => u._id === userId)
      );

      if (chatToOpen) {
        setSelectedChat(chatToOpen);
      }

      setSearchMode(false);
      setQuery("");
    } catch (err) {
      console.error("Create chat failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-16">
      <div className="feed flex gap-4">
        {/* LEFT */}
        <div className="w-full md:w-[30%] card p-3">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                setSearchMode((p) => !p);
                setQuery("");
              }}
              className="btn-primary p-2 rounded-full"
            >
              {searchMode ? "✕" : <FaSearch />}
            </button>

            {searchMode && (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users"
                className="custom-input flex-1"
              />
            )}
          </div>

          {searchMode ? (
            <div className="space-y-2">
              {searching ? (
                <p className="text-sm text-center text-gray-500">
                  Searching…
                </p>
              ) : users.length ? (
                users.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => createNewChat(u._id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={u.profilePic.url}
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="truncate">{u.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">
                  No users found
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((c) => {
                const otherUser = c.users.find(
                  (u) => u._id !== user._id
                );

                return (
                  <Chat
                    key={c._id}
                    chat={c}
                    setSelectedChat={setSelectedChat}
                    isOnline={
                      otherUser &&
                      onlineUsers.includes(otherUser._id)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="hidden md:block md:w-[70%] card p-0">
          {selectedChat ? (
            <MessageContainer
              selectedChat={selectedChat}
              setChats={setChats}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Hello 👋 {user.name}, select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
