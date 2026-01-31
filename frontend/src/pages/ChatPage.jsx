import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaComments } from "react-icons/fa";
import { FaPaperPlane, FaBolt } from "react-icons/fa6";

import { ChatData } from "../context/ChatContext";
import { SocketData } from "../context/SocketContext";

import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import api from "../utils/axios";

// ✅ NEW: visual wrapper only
import GlassCard from "../ui/GlassCard";

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
     PARALLAX BACKGROUND (UNCHANGED)
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 80}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 80}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     FETCH CHATS (UNCHANGED)
     =============================== */
  useEffect(() => {
    const loadChats = async () => {
      const { data } = await api.get("/messages/chats");
      setChats(data || []);
    };
    loadChats();
  }, [setChats]);

  /* ===============================
     SEARCH USERS (UNCHANGED)
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
     CREATE CHAT (UNCHANGED)
     =============================== */
  const createNewChat = async (userId) => {
    try {
      await createChat(userId);

      const { data } = await api.get("/messages/chats");
      setChats(data || []);

      const chatToOpen = data.find((c) =>
        c.users.some((u) => u._id === userId)
      );

      if (chatToOpen) setSelectedChat(chatToOpen);

      setSearchMode(false);
      setQuery("");
    } catch (err) {
      console.error("Create chat failed", err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated background */}
      <div className="parallax" />

      {/* Floating icons */}
      <div className="floating-icons">
        <FaComments
          className="floating-icon text-blue-400 text-4xl"
          style={{ left: "15%" }}
        />
        <FaPaperPlane
          className="floating-icon text-cyan-400 text-4xl"
          style={{ left: "45%", animationDelay: "8s" }}
        />
        <FaBolt
          className="floating-icon text-purple-400 text-4xl"
          style={{ left: "75%", animationDelay: "14s" }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4">
            {/* LEFT PANEL */}
            <GlassCard className="w-full md:w-[32%] p-4 flex flex-col">
              {/* Search Bar */}
              <div className="flex items-center gap-2 mb-4">
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

              {/* Chat List / Search Results */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {searchMode ? (
                  searching ? (
                    <p className="text-sm text-center text-gray-400">
                      Searching…
                    </p>
                  ) : users.length ? (
                    users.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => createNewChat(u._id)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/20 transition"
                      >
                        <img
                          src={u.profilePic.url}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-400"
                        />
                        <span className="font-medium truncate">
                          {u.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-gray-400">
                      No users found
                    </p>
                  )
                ) : chats.length ? (
                  chats.map((c) => {
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
                  })
                ) : (
                  <p className="text-sm text-center text-gray-400">
                    No chats yet
                  </p>
                )}
              </div>
            </GlassCard>

            {/* RIGHT PANEL */}
            <div className="hidden md:flex md:w-[68%]">
              <GlassCard className="w-full overflow-hidden">
                {selectedChat ? (
                  <MessageContainer
                    selectedChat={selectedChat}
                    setChats={setChats}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <FaComments className="text-4xl opacity-60" />
                    <p className="text-lg">
                      Hello {user.name}, select a chat to start messaging
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
