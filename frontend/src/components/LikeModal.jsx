import React from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "./Loading";

const LikeModal = ({ isOpen, onClose, likes = [] }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 shadow-lg w-64 max-h-[300px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Likes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {likes.length > 0 ? (
          <div className="flex flex-col gap-2">
            {likes.map((user, index) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                onClick={onClose}
                className="bg-gray-500 py-2 px-3 text-white rounded-md flex items-center gap-3"
              >
                <span>{index + 1}</span>
                <img
                  src={user.profilePic?.url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No likes yet</p>
        )}
      </div>
    </div>
  );
};

export default LikeModal;
