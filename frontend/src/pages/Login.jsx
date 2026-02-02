import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, ShieldAlert } from "lucide-react";

import { UserData } from "../context/UserContext";
import FloatingIcons from "../components/FloatingIcons";

/* =========================================================
   LOGIN — CLEAN + GLASS + FLOATING ICONS
========================================================= */
const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = UserData();
  const prefersReducedMotion = useReducedMotion();

  /* ===============================
     STATE
     =============================== */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  /* ===============================
     RESTORE REMEMBER-ME
     =============================== */
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ===============================
     PASSWORD STRENGTH
     =============================== */
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthMap = [
    { label: "Weak", color: "bg-red-500", icon: ShieldAlert },
    { label: "Fair", color: "bg-orange-500", icon: ShieldAlert },
    { label: "Good", color: "bg-yellow-500", icon: ShieldCheck },
    { label: "Strong", color: "bg-green-500", icon: ShieldCheck },
  ];

  const StrengthIcon = strengthMap[Math.max(0, strength - 1)]?.icon;

  /* ===============================
     CAPS LOCK DETECTION
     =============================== */
  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  /* ===============================
     SUBMIT
     =============================== */
  const submitHandler = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.removeItem("remember_email");
    }

    console.info("[AUTH_TELEMETRY]", {
      event: "login_attempt",
      strength,
      rememberMe,
      timestamp: Date.now(),
    });

    loginUser(email, password, navigate);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Signing you in…
      </div>
    );
  }

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b0616] via-[#140b2d] to-[#090514]">
      
      {/* 🌌 FLOATING ICONS BACKGROUND */}
      <FloatingIcons count={14} />

      {/* AUTH LAYER */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="relative glass glass-hover w-full max-w-md p-8 transform-gpu"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <h1 className="text-3xl font-bold text-center mb-1">
            Welcome Back 👋
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Secure access to your account
          </p>

          <form onSubmit={submitHandler} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="custom-input"
              required
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Password"
                className="custom-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CAPS LOCK */}
            {capsLock && (
              <div className="text-sm text-yellow-400">
                ⚠️ Caps Lock is ON
              </div>
            )}

            {/* PASSWORD STRENGTH */}
            {password && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-2 rounded bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full transition-all ${strengthMap[Math.max(0, strength - 1)]?.color}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
                <span className="flex items-center gap-1 text-gray-300">
                  {StrengthIcon && <StrengthIcon size={16} />}
                  {strengthMap[Math.max(0, strength - 1)]?.label}
                </span>
              </div>
            )}

            {/* REMEMBER ME */}
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="auth-btn w-full"
            >
              Login
            </motion.button>
          </form>

          {/* DEV PORTFOLIO */}
          <button
            type="button"
            onClick={() => (window.location.href = "/portfolio/index.html")}
            className="mt-4 w-full text-sm text-blue-400 hover:underline"
          >
            Developer Info
          </button>

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
    </div>
  );
};

export default Login;
