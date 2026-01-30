import React, { useEffect } from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import AiChat from "../components/AiChat";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   HOME / FEED (ENHANCED UI – SAFE)
   ========================================================= */
const Home = () => {
  const { posts, loading } = PostData();

  /* ===============================
     PARALLAX EFFECT
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 50}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 50}px`
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* PARALLAX BACKGROUND */}
      <div className="parallax" />

      {/* FLOATING SOCIAL ICONS */}
      <div className="floating-icons">
        <FaFacebookF
          className="floating-icon text-blue-500 text-4xl"
          style={{ left: "5%", animationDelay: "0s" }}
        />
        <FaInstagram
          className="floating-icon text-pink-500 text-4xl"
          style={{ left: "25%", animationDelay: "6s" }}
        />
        <FaTwitter
          className="floating-icon text-sky-400 text-4xl"
          style={{ left: "55%", animationDelay: "12s" }}
        />
        <FaLinkedin
          className="floating-icon text-blue-400 text-4xl"
          style={{ left: "80%", animationDelay: "18s" }}
        />
      </div>

      {/* MAIN FEED */}
      <div className="relative z-10 px-3 sm:px-4">
        <div
          className="
            max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl
            mx-auto
            space-y-6
          "
        >
          {/* CREATE POST */}
          <div className="glass p-4 sm:p-5">
            <AddPost type="post" />
          </div>

          {/* AI CHAT */}
          <div className="glass p-4 sm:p-5">
            <AiChat />
          </div>

          {/* POSTS */}
          {loading ? (
            <div className="flex justify-center py-14">
              <Loading />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  value={post}
                  type="post"
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

/* =========================================================
   EMPTY STATE
   ========================================================= */
const EmptyState = () => {
  return (
    <div className="glass p-10 text-center">
      <h3 className="text-xl font-semibold mb-2">
        No posts yet ✨
      </h3>
      <p className="text-sm text-gray-400 max-w-sm mx-auto">
        Start the conversation. Share your first post and
        light up the feed.
      </p>
    </div>
  );
};
