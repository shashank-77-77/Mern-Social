import React from "react";

/* =========================================================
   FULL PAGE LOADING (APP / ROUTE LEVEL)
========================================================= */
export const Loading = ({ text = "Loading…" }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
      <div className="flex flex-col items-center gap-4">
        {/* Glow Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>

        {/* Text */}
        <p className="text-sm text-gray-500 tracking-wide">
          {text}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   INLINE LOADING (BUTTONS / ACTIONS)
========================================================= */
export const LoadingAnimation = ({ size = 4 }) => {
  return (
    <span
      className={`
        inline-block
        w-${size}
        h-${size}
        border-2
        border-current
        border-t-transparent
        rounded-full
        animate-spin
      `}
      aria-label="Loading"
    />
  );
};

/* =========================================================
   SKELETON BLOCK (LISTS / FEEDS)
========================================================= */
export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-lg
        bg-gray-200/70
        dark:bg-gray-700/40
        ${className}
      `}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};
