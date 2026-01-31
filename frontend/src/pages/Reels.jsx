import React, { useState } from "react";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { Loading } from "../components/Loading";
import { PostData } from "../context/PostContext";

/* =========================================================
   REELS PAGE — GLASS / DEPTH SAFE
========================================================= */
const Reels = () => {
  const { reels = [], loading } = PostData();
  const [index, setIndex] = useState(0);

  /* ===============================
     NAVIGATION
     =============================== */
  const prevReel = () =>
    setIndex((i) => (i > 0 ? i - 1 : i));

  const nextReel = () =>
    setIndex((i) =>
      i < reels.length - 1 ? i + 1 : i
    );

  /* ===============================
     GUARD
     =============================== */
  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="relative min-h-screen overflow-hidden pb-24 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ADD REEL */}
          <div className="glass card">
            <AddPost type="reel" />
          </div>

          {/* REEL VIEWER */}
          {reels.length > 0 ? (
            <div className="glass card flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Reel */}
              <div className="flex justify-center w-full sm:w-auto">
                <PostCard
                  key={reels[index]._id}
                  value={reels[index]}
                  type="reel"
                />
              </div>

              {/* Controls */}
              <div className="flex sm:flex-col gap-4">
                {index > 0 && (
                  <button
                    onClick={prevReel}
                    aria-label="Previous reel"
                    className="
                      btn-primary
                      rounded-full
                      p-4
                      shadow
                      hover:scale-105
                      active:scale-95
                      transition
                    "
                  >
                    <FaArrowUp />
                  </button>
                )}

                {index < reels.length - 1 && (
                  <button
                    onClick={nextReel}
                    aria-label="Next reel"
                    className="
                      btn-primary
                      rounded-full
                      p-4
                      shadow
                      hover:scale-105
                      active:scale-95
                      transition
                    "
                  >
                    <FaArrowDownLong />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass card p-8 text-center">
              <h3 className="text-lg font-semibold mb-1">
                No reels yet
              </h3>
              <p className="text-sm text-gray-400">
                Upload your first reel and engage your audience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
