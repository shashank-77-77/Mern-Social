import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";

/* =========================================================
   FLOATING DOCK NAVBAR (SAFE)
========================================================= */
const NavigationBar = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          glass
          px-6 py-3
          rounded-2xl
          flex gap-6 items-center
          shadow-xl
          backdrop-blur-xl
        "
      >
        <NavItem
          to="/"
          active={pathname === "/"}
          iconActive={<AiFillHome />}
          iconInactive={<AiOutlineHome />}
        />

        <NavItem
          to="/reels"
          active={pathname === "/reels"}
          iconActive={<BsCameraReelsFill />}
          iconInactive={<BsCameraReels />}
        />

        <NavItem
          to="/search"
          active={pathname === "/search"}
          iconActive={<IoSearchCircle />}
          iconInactive={<IoSearchCircleOutline />}
        />

        <NavItem
          to="/chat"
          active={pathname === "/chat"}
          iconActive={<IoChatbubbleEllipses />}
          iconInactive={<IoChatbubbleEllipsesOutline />}
        />

        <NavItem
          to="/account"
          active={pathname === "/account"}
          iconActive={<RiAccountCircleFill />}
          iconInactive={<RiAccountCircleLine />}
        />
      </div>
    </div>
  );
};

export default NavigationBar;

/* =========================================================
   NAV ITEM — DOCK ICON
========================================================= */
const NavItem = ({ to, active, iconActive, iconInactive }) => {
  return (
    <Link
      to={to}
      className="
        relative
        flex items-center justify-center
        text-2xl
        transition-all
        duration-300
        transform-gpu
        hover:-translate-y-2
        hover:scale-110
        active:scale-95
      "
    >
      <span
        className={`
          transition-all
          duration-300
          ${
            active
              ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-125"
              : "text-gray-400"
          }
        `}
      >
        {active ? iconActive : iconInactive}
      </span>
    </Link>
  );
};
