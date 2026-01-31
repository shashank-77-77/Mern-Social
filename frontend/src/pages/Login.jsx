import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   LOGIN — 3D GLASS / REACT-BITS STYLE
   (LOGIC UNCHANGED)
========================================================= */

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ===============================
     PARALLAX EFFECT (GPU SAFE)
     =============================== */
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 45;
      const y = (e.clientY - window.innerHeight / 2) / 45;

      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     SUBMIT (UNCHANGED)
     =============================== */
  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    loginUser(email, password, navigate, fetchPosts);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Signing you in…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* PARALLAX BACKGROUND */}
      <div className="parallax" />

      {/* FLOATING SOCIAL ICONS */}
      <div className="floating-icons">
        <FaFacebookF
          className="floating-icon text-blue-500 text-5xl"
          style={{ left: "12%", animationDelay: "0s" }}
        />
        <FaInstagram
          className="floating-icon text-pink-500 text-5xl"
          style={{ left: "32%", animationDelay: "6s" }}
        />
        <FaTwitter
          className="floating-icon text-sky-400 text-5xl"
          style={{ left: "62%", animationDelay: "12s" }}
        />
        <FaLinkedin
          className="floating-icon text-blue-400 text-5xl"
          style={{ left: "82%", animationDelay: "18s" }}
        />
      </div>

      {/* 3D GLASS LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="
          glass
          w-full
          max-w-md
          p-8
          relative
          z-10
          transform-gpu
        "
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-1">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Login to continue your journey
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input"
            required
          />

          <motion.button
            whileTap={{ scale: 0.96 }}
            className="auth-btn w-full"
          >
            Login
          </motion.button>
        </form>

        {/* CTA */}
        <div className="text-center mt-6 text-sm text-gray-400">
          New here?
          <Link
            to="/register"
            className="text-cyan-400 font-semibold ml-1 hover:underline"
          >
            Create an account →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
