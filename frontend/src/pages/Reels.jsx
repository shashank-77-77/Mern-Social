import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import { Loading } from "../components/Loading";

const Reels = () => {
  const { reels, loading } = PostData();
  const [index, setIndex] = useState(0);

  /* ---------- Keep index in bounds ---------- */
  useEffect(() => {
    if (reels.length === 0) {
      setIndex(0);
    } else if (index > reels.length - 1) {
      setIndex(reels.length - 1);
    }
  }, [reels, index]);

  const prevReel = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextReel = () => {
    setIndex((prev) => Math.min(prev + 1, reels.length - 1));
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-100">
      <AddPost type="reel" />

      <div className="flex m-auto gap-3 w-[300px] md:w-[500px] justify-center">
        {reels.length > 0 ? (
          <>
            <PostCard
              key={reels[index]._id}
              value={reels[index]}
              type="reel"
            />

            <div className="flex flex-col justify-center items-center gap-6">
              {index > 0 && (
                <button
                  className="bg-gray-500 text-white py-5 px-5 rounded-full"
                  onClick={prevReel}
                >
                  <FaArrowUp />
                </button>
              )}

              {index < reels.length - 1 && (
                <button
                  className="bg-gray-500 text-white py-5 px-5 rounded-full"
                  onClick={nextReel}
                >
                  <FaArrowDownLong />
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No reels yet. Be the first to post one.
          </p>
        )}
      </div>
    </div>
  );
};

export default Reels;
