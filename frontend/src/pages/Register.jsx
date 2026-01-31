import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   REGISTER — 3D GLASS / REACT-BITS STYLE
========================================================= */
const Register = () => {
  const navigate = useNavigate();
  const { registerUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState(null);

  /* ===============================
     PARALLAX (GPU SAFE)
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
     PASSWORD STRENGTH (VISUAL ONLY)
     =============================== */
  const passwordStrength = useMemo(() => {
    if (!password) return { label: "", color: "" };

    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    if (password.length < 7) {
      return { label: "Weak", color: "bg-red-500" };
    }

    if (password.length >= 7 && hasNumber && hasSymbol) {
      return { label: "Strong", color: "bg-green-500" };
    }

    return { label: "Medium", color: "bg-yellow-500" };
  }, [password]);

  /* ===============================
     FILE PREVIEW
     =============================== */
  const changeFileHandler = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setFilePrev(reader.result);
    reader.readAsDataURL(f);
  };

  /* ===============================
     SUBMIT (UNCHANGED)
     =============================== */
  const submitHandler = (e) => {
    e.preventDefault();

    if (password.length < 7 || password.length > 10) {
      toast.error("Password must be 7–10 characters");
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("gender", gender);
    fd.append("file", file);

    registerUser(fd, navigate, fetchPosts);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Creating your account…
      </div>
    );
  }

  return (
    <div className="page">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="parallax" />

        {/* Floating Icons */}
        <div className="floating-icons pointer-events-none">
          <FaFacebookF className="floating-icon text-blue-500 text-5xl" style={{ left: "12%", animationDelay: "0s" }} />
          <FaInstagram className="floating-icon text-pink-500 text-5xl" style={{ left: "32%", animationDelay: "5s" }} />
          <FaTwitter className="floating-icon text-sky-400 text-5xl" style={{ left: "62%", animationDelay: "10s" }} />
          <FaLinkedin className="floating-icon text-blue-400 text-5xl" style={{ left: "82%", animationDelay: "15s" }} />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          whileHover={{ rotateX: 6, rotateY: -6, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="glass card w-full max-w-md p-8 relative z-10 transform-gpu"
        >
          <h1 className="text-3xl font-bold text-center mb-1">
            Join the Network 🚀
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Create, connect & grow with your community
          </p>

          <form onSubmit={submitHandler} className="space-y-4">
            {filePrev && (
              <motion.img
                src={filePrev}
                alt="preview"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full mx-auto object-cover border border-cyan-400"
              />
            )}

            <input type="file" onChange={changeFileHandler} className="custom-input" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" className="custom-input" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="custom-input" required />

            {/* Password */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (7–10 chars)"
              className="custom-input"
              required
            />

            {/* Strength Meter */}
            {password && (
              <div className="space-y-1">
                <div className="h-2 w-full bg-gray-700 rounded overflow-hidden">
                  <div className={`h-full ${passwordStrength.color} transition-all`} style={{ width: "100%" }} />
                </div>
                <p className="text-xs text-gray-400">
                  Strength: <span className="font-semibold">{passwordStrength.label}</span>
                </p>
              </div>
            )}

            <select value={gender} onChange={(e) => setGender(e.target.value)} className="custom-input" required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <motion.button whileTap={{ scale: 0.96 }} className="auth-btn w-full">
              Create Account
            </motion.button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            Already inside the circle?
            <Link to="/login" className="text-cyan-400 font-semibold ml-1 hover:underline">
              Login →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
