import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col space-y-4 text-center">
        <div className="text-gray-600 text-xl font-medium">
          Social Media
        </div>

        <div className="text-5xl font-medium">
          Page not found
        </div>

        <div className="text-gray-500">
          Sorry, this page isn’t available.
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 px-4 py-2 text-white font-medium rounded-lg hover:scale-105 transition"
          >
            Visit homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
