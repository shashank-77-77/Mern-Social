import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReels, BsCameraReelsFill } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import {
  RiAccountCircleFill,
  RiAccountCircleLine,
} from "react-icons/ri";

const NavigationBar = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 w-full bg-white py-3 border-t z-40">
      <div className="flex justify-around">
        <Link to="/" className="text-2xl">
          {pathname === "/" ? <AiFillHome /> : <AiOutlineHome />}
        </Link>

        <Link to="/reels" className="text-2xl">
          {pathname === "/reels" ? (
            <BsCameraReelsFill />
          ) : (
            <BsCameraReels />
          )}
        </Link>

        <Link to="/search" className="text-2xl">
          {pathname === "/search" ? (
            <IoSearchCircle />
          ) : (
            <IoSearchCircleOutline />
          )}
        </Link>

        <Link to="/chat" className="text-2xl">
          {pathname === "/chat" ? (
            <IoChatbubbleEllipses />
          ) : (
            <IoChatbubbleEllipsesOutline />
          )}
        </Link>

        <Link to="/account" className="text-2xl">
          {pathname === "/account" ? (
            <RiAccountCircleFill />
          ) : (
            <RiAccountCircleLine />
          )}
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
