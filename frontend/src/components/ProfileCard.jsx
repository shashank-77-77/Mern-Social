import React, { useEffect, useRef, useCallback, useMemo } from "react";

/* ===== CONFIG ===== */
const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const clamp = (v, min = 0, max = 100) =>
  Math.min(Math.max(v, min), max);

/* ===== KEYFRAMES (Injected Once) ===== */
const KEYFRAMES_ID = "pc-keyframes";
if (typeof document !== "undefined" && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 50%, 0 0, center; }
      100% { background-position: 0 50%, 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

function ProfileCard({
  avatarUrl,
  miniAvatarUrl,
  iconUrl,
  grainUrl,
  name,
  title,
  handle,
  status,
  contactText,
  onContactClick
}) {
  const wrapRef = useRef(null);

  const cardStyle = useMemo(() => ({
    "--icon": iconUrl ? `url(${iconUrl})` : "none",
    "--grain": grainUrl ? `url(${grainUrl})` : "none",
    "--inner-gradient": DEFAULT_INNER_GRADIENT,
    "--pointer-x": "50%",
    "--pointer-y": "50%",
    "--card-radius": "30px"
  }), [iconUrl, grainUrl]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{
        width: "320px",
        height: "520px",
        borderRadius: "30px",
        background: "rgba(0,0,0,0.9)",
        ...cardStyle
      }}
    >
      <img
        src={avatarUrl}
        alt={name}
        className="absolute bottom-0 w-full rounded-[30px]"
      />

      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-xl p-4 flex justify-between items-center">
        <div>
          <div className="text-white text-sm font-semibold">@{handle}</div>
          <div className="text-white/70 text-xs">{status}</div>
        </div>
        <button
          onClick={onContactClick}
          className="text-xs text-white border border-white/20 rounded-lg px-3 py-2 hover:border-white/40"
        >
          {contactText}
        </button>
      </div>

      <div className="absolute top-8 w-full text-center">
        <h3 className="text-white text-2xl font-semibold">{name}</h3>
        <p className="text-white/70 text-sm">{title}</p>
      </div>
    </div>
  );
}

export default React.memo(ProfileCard);
