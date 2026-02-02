import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import ProfileCard from "../components/ProfileCard";
import FluidGlass from "../components/ui/FluidGlass";
import About from "../components/About";

/* =========================================================
   SOCIAL LINKS (CONFIG)
========================================================= */
const SOCIALS = [
  { label: "GitHub", icon: "🐙", url: "https://github.com/shashank-77-77" },
  { label: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/shashankmankar" },
  { label: "X", icon: "✖️", url: "https://x.com/shashankmankar7" },
  { label: "Telegram", icon: "📨", url: "https://t.me/shashankmankar777" },
  { label: "LeetCode", icon: "🧠", url: "https://leetcode.com/u/shashankmankar777/" },
  { label: "Facebook", icon: "📘", url: "https://www.facebook.com/ShashankMankar18" },
  { label: "Instagram", icon: "📸", url: "https://www.instagram.com/shashankmankar18" },
];

/* =========================================================
   DEFAULT THEME TOKENS (SAFE FALLBACK)
========================================================= */
const DEFAULT_THEME = {
  glassOpacity: 0.06,
  blur: 24,
  refractionBase: 0.35,
};

/* =========================================================
   DEVELOPER PAGE — FULL FEATURED
========================================================= */
export default function Developer() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  /* ===============================
     BACKEND THEME TOKENS (SAFE)
     =============================== */
  const [themeTokens, setThemeTokens] = useState(DEFAULT_THEME);

  useEffect(() => {
    fetch("/api/theme-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setThemeTokens({ ...DEFAULT_THEME, ...data }))
      .catch(() => {});
  }, []);

  /* ===============================
     SCROLL TRACKING
     =============================== */
  const { scrollYProgress } = useScroll();
  const refraction = useTransform(
    scrollYProgress,
    [0, 1],
    [themeTokens.refractionBase, themeTokens.refractionBase + 0.25]
  );

  const navOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  /* ===============================
     DEVICE DETECTION
     =============================== */
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ===============================
     PARALLAX TILT
     =============================== */
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const move = (e) => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      setTilt({
        x: (-(e.clientY - r.top - r.height / 2) / r.height) * 6,
        y: ((e.clientX - r.left - r.width / 2) / r.width) * 6,
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile, prefersReducedMotion]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-slate-200">

      {/* =====================================================
         AMBIENT GRAIN OVERLAY
         ===================================================== */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay">
        <div className="w-full h-full bg-[url('/grain.png')] bg-repeat" />
      </div>

      {/* =====================================================
         GLASS NAVBAR (SCROLL REACTIVE)
         ===================================================== */}
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold">Developer</span>
          <button
            onClick={() => navigate("/login")}
            className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            Back
          </button>
        </div>
      </motion.nav>

      {/* =====================================================
         BACKGROUND GLASS REFRACTION
         ===================================================== */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none">
        <FluidGlass
          dpr={[1, 1.25]}
          mode="lens"
          lensProps={{
            scale: refraction,
            ior: 1.08,
            thickness: 1.6,
            chromaticAberration: 0.015,
            anisotropy: 0.01,
          }}
        />
      </motion.div>

      {/* =====================================================
         HERO SECTION
         ===================================================== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 gap-8">
        <motion.div
          ref={cardRef}
          animate={prefersReducedMotion ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ transformStyle: "preserve-3d" }}
          className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-1"
        >
          <ProfileCard
            name="Shashank"
            title="Full Stack MERN Developer"
            handle="shashank-dev"
            status="Building scalable systems with clarity and intent"
            avatarUrl="/avatar.png"
            miniAvatarUrl="/avatar.png"
            iconUrl="/icon.png"
            grainUrl="/grain.png"
            contactText="GitHub"
            onContactClick={() =>
              window.open("https://github.com/shashank-77-77", "_blank")
            }
          />
        </motion.div>

        {/* =====================================================
           SOCIAL GLASS BUTTONS
           ===================================================== */}
        <div className="flex flex-wrap gap-4 justify-center">
          {SOCIALS.map((s) => (
            <motion.button
              key={s.label}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(s.url, "_blank")}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/5 border border-white/10
                         backdrop-blur-xl hover:bg-white/10 transition"
              aria-label={s.label}
            >
              <span>{s.icon}</span>
              <span className="text-sm">{s.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* =====================================================
         ABOUT SECTION (GLASS SURFACE)
         ===================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 pb-24"
      >
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
          <About />
        </div>
      </motion.section>
    </div>
  );
}
