import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* =========================================================
   404 — NOT FOUND (GLASS / 3D STYLE)
========================================================= */
const NotFound = () => {
  const navigate = useNavigate();

  /* ===============================
     PARALLAX (LIGHT, GPU SAFE)
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 60}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 60}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="page">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-main)]">
        {/* Parallax background */}
        <div className="parallax" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="
            glass
            card
            w-full
            max-w-md
            p-8
            text-center
            relative
            z-10
            transform-gpu
          "
        >
          {/* Brand */}
          <div className="text-xs tracking-wide text-gray-400 mb-2">
            Social Media Platform
          </div>

          {/* Code */}
          <div className="text-6xl font-bold text-cyan-400 mb-2">
            404
          </div>

          {/* Headline */}
          <h1 className="text-2xl font-semibold mb-2">
            Page not found
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 mb-6">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="btn-primary w-full"
          >
            Go to Homepage
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
