import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingAnimation } from "./Loading";

/* =========================================================
   LIKE MODAL — GLASS + MOTION (SAFE)
========================================================= */

const LikeModal = ({ isOpen, onClose, id }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH LIKES
     =============================== */
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchLikes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/post/${id}`);
        setUsers(data || []);
      } catch (err) {
        console.error("Fetch likes failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [id, isOpen]);

  /* ===============================
     GUARD
     =============================== */
  if (!isOpen) return null;

  /* ===============================
     RENDER
     =============================== */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="
            glass card
            relative
            w-[320px]
            max-h-[420px]
            p-4
            flex flex-col
            z-10
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Likes</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingAnimation />
              </div>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <Link
                  key={user._id}
                  to={`/user/${user._id}`}
                  onClick={onClose}
                  className="
                    flex items-center gap-3
                    px-3 py-2
                    rounded-xl
                    hover:bg-white/40
                    transition
                  "
                >
                  <span className="text-xs text-gray-400 w-5">
                    {index + 1}
                  </span>

                  <img
                    src={user.profilePic.url}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <span className="font-medium text-sm truncate">
                    {user.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="text-center text-sm text-gray-400 mt-8">
                No likes yet
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LikeModal;
