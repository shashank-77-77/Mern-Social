import React, { useState } from "react";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { Loading } from "../components/Loading";

import { PostData } from "../context/PostContext";

/* =========================================================
   REELS PAGE
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

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-20 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Add Reel */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <AddPost type="reel" />
        </div>

        {/* Reel Viewer */}
        {reels.length > 0 ? (
          <div
            className="
              bg-white
              rounded-2xl
              shadow-md
              p-4 sm:p-6
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-6
            "
          >
            {/* Reel */}
            <div className="flex justify-center">
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
                  className="
                    btn-primary
                    rounded-full
                    p-4
                    shadow
                    hover:scale-105
                    transition-transform
                  "
                  aria-label="Previous reel"
                >
                  <FaArrowUp />
                </button>
              )}

              {index < reels.length - 1 && (
                <button
                  onClick={nextReel}
                  className="
                    btn-primary
                    rounded-full
                    p-4
                    shadow
                    hover:scale-105
                    transition-transform
                  "
                  aria-label="Next reel"
                >
                  <FaArrowDownLong />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No reels yet
            </h3>
            <p className="text-sm text-gray-500">
              Upload your first reel and engage your audience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
