import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ===============================
     PARALLAX EFFECT (SAME AS REGISTER)
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 40}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 40}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     SUBMIT (UNCHANGED LOGIC)
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
      {/* Parallax */}
      <div className="parallax" />

      {/* Floating Social Icons */}
      <div className="floating-icons">
        <FaFacebookF
          className="floating-icon text-blue-500 text-5xl"
          style={{ left: "15%", animationDelay: "0s" }}
        />
        <FaInstagram
          className="floating-icon text-pink-500 text-5xl"
          style={{ left: "35%", animationDelay: "6s" }}
        />
        <FaTwitter
          className="floating-icon text-sky-400 text-5xl"
          style={{ left: "65%", animationDelay: "12s" }}
        />
        <FaLinkedin
          className="floating-icon text-blue-400 text-5xl"
          style={{ left: "85%", animationDelay: "18s" }}
        />
      </div>

      {/* GLASS CARD */}
      <div className="glass w-full max-w-md p-8 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Login to continue your journey
        </p>

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

          <button className="auth-btn">
            Login
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-400">
          New here?
          <Link
            to="/register"
            className="text-cyan-400 font-semibold ml-1"
          >
            Create an account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
