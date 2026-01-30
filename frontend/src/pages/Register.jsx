import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin
} from "react-icons/fa";

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
     PARALLAX EFFECT
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

  const changeFileHandler = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onloadend = () => setFilePrev(r.result);
    r.readAsDataURL(f);
  };

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax */}
      <div className="parallax" />

      {/* Floating Icons */}
      <div className="floating-icons">
        <FaFacebookF className="floating-icon text-blue-500 text-5xl" style={{ left: "10%", animationDelay: "0s" }} />
        <FaInstagram className="floating-icon text-pink-500 text-5xl" style={{ left: "30%", animationDelay: "5s" }} />
        <FaTwitter className="floating-icon text-sky-400 text-5xl" style={{ left: "60%", animationDelay: "10s" }} />
        <FaLinkedin className="floating-icon text-blue-400 text-5xl" style={{ left: "80%", animationDelay: "15s" }} />
      </div>

      {/* CARD */}
      <div className="glass w-full max-w-md p-8 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          Join the Network 🚀
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Create, connect & grow with your community
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          {filePrev && (
            <img
              src={filePrev}
              alt="preview"
              className="w-24 h-24 rounded-full mx-auto object-cover border border-cyan-400"
            />
          )}

          <input type="file" onChange={changeFileHandler} className="custom-input" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" className="custom-input" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="custom-input" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="custom-input" />

          <select value={gender} onChange={(e) => setGender(e.target.value)} className="custom-input">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button className="auth-btn">Create Account</button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-400">
          Already inside the circle?
          <Link to="/login" className="text-cyan-400 font-semibold ml-1">
            Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
