import React from "react";
import { Link } from "react-router-dom";

const Modal = ({ value = [], title, setShow }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
      onClick={() => setShow(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg p-4 shadow-lg w-[300px] max-h-[300px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl text-blue-600">{title}</h1>
          <button
            onClick={() => setShow(false)}
            className="text-gray-500 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col space-y-2 mt-2">
          {value.length > 0 ? (
            value.map((e, i) => (
              <Link
                key={e._id}
                to={`/user/${e._id}`}
                onClick={() => setShow(false)}
                className="bg-gray-500 py-2 px-3 text-white rounded-md flex items-center gap-3"
              >
                <span>{i + 1}</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={e.profilePic?.url}
                  alt={e.name}
                />
                <span>{e.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No {title.toLowerCase()} yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
