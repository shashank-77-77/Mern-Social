import React, { useMemo } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   FLOATING ICON SYSTEM
   - Procedural
   - GPU-safe
   - Zero layout coupling
========================================================= */

const ICONS = [
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
];

const COLORS = [
  "text-blue-400",
  "text-sky-400",
  "text-cyan-400",
  "text-pink-400",
  "text-indigo-400",
  "text-purple-400",
];

export default function FloatingIcons({ count = 12 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];

      return {
        id: i,
        Icon,
        left: `${Math.random() * 100}%`,
        size: 28 + Math.random() * 28,
        delay: `${Math.random() * 12}s`,
        duration: `${18 + Math.random() * 14}s`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotate: Math.random() > 0.5 ? 1 : -1,
      };
    });
  }, [count]);

  return (
    <div className="floating-icons pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {items.map(
        ({ id, Icon, left, size, delay, duration, color, rotate }) => (
          <Icon
            key={id}
            className={`floating-icon ${color}`}
            style={{
              left,
              fontSize: size,
              animationDelay: delay,
              animationDuration: duration,
              animationDirection: rotate > 0 ? "normal" : "reverse",
            }}
          />
        )
      )}
    </div>
  );
}
