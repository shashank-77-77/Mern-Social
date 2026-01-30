import React from "react";
import { Link, useLocation } from "react-router-dom";

import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
} from "react-icons/ri";

/* =========================================================
   BOTTOM NAVIGATION BAR (POLISHED – SAFE)
   ========================================================= */
const NavigationBar = () => {
  const { pathname } = useLocation();

  return (
    <div className="bottom-nav">
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
  );
};

export default NavigationBar;

/* =========================================================
   NAV ITEM
   ========================================================= */
const NavItem = ({ to, active, iconActive, iconInactive }) => {
  return (
    <Link
      to={to}
      className={`bottom-nav-item ${active ? "active" : ""}`}
    >
      <span className="icon">
        {active ? iconActive : iconInactive}
      </span>

      {/* Active indicator */}
      {active && <span className="active-dot" />}
    </Link>
  );
};
