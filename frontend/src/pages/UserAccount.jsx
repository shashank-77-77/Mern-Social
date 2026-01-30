import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { SocketData } from "../context/SocketContext";

import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";

import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   USER ACCOUNT / PROFILE PAGE (ENHANCED UI)
   ========================================================= */
const UserAccount = ({ user: loggedInUser }) => {
  const { id } = useParams();

  const { posts = [], reels = [] } = PostData();
  const { followUser } = UserData();
  const { onlineUsers } = SocketData();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("post");
  const [reelIndex, setReelIndex] = useState(0);
  const [followed, setFollowed] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  /* ===============================
     PARALLAX BACKGROUND
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 70}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 70}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     FETCH USER
     =============================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/${id}`);
        setUser(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  /* ===============================
     FOLLOW STATE
     =============================== */
  useEffect(() => {
    if (!user || !loggedInUser) return;
    setFollowed(user.followers?.includes(loggedInUser._id));
  }, [user, loggedInUser]);

  const followHandler = () => {
    if (!user) return;
    setFollowed((p) => !p);
    followUser(user._id, () => {
      axios.get(`/api/user/${id}`).then(({ data }) => setUser(data));
    });
  };

  /* ===============================
     FOLLOW DATA
     =============================== */
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`/api/user/followdata/${user._id}`)
      .then(({ data }) => {
        setFollowersData(data.followers || []);
        setFollowingsData(data.followings || []);
      })
      .catch(() => {});
  }, [user]);

  /* ===============================
     DERIVED DATA
     =============================== */
  const myPosts = useMemo(
    () => posts.filter((p) => p.owner?._id === user?._id),
    [posts, user]
  );

  const myReels = useMemo(
    () => reels.filter((r) => r.owner?._id === user?._id),
    [reels, user]
  );

  const prevReel = () => setReelIndex((i) => (i > 0 ? i - 1 : i));
  const nextReel = () =>
    setReelIndex((i) =>
      i < myReels.length - 1 ? i + 1 : i
    );

  /* ===============================
     GUARD
     =============================== */
  if (loading) return <Loading />;
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        User not found
      </div>
    );

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated background */}
      <div className="parallax" />

      {/* Floating icons */}
      <div className="floating-icons">
        <FaFacebookF className="floating-icon text-blue-500 text-4xl" style={{ left: "12%" }} />
        <FaInstagram className="floating-icon text-pink-500 text-4xl" style={{ left: "32%", animationDelay: "7s" }} />
        <FaTwitter className="floating-icon text-sky-400 text-4xl" style={{ left: "58%", animationDelay: "13s" }} />
        <FaLinkedin className="floating-icon text-blue-400 text-4xl" style={{ left: "82%", animationDelay: "19s" }} />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* PROFILE CARD */}
          <div className="glass p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex justify-center sm:justify-start">
              <img
                src={user.profilePic.url}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-cyan-400"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex justify-center sm:justify-start items-center gap-2">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                {onlineUsers.includes(user._id) && (
                  <span className="text-xs text-green-400">Online</span>
                )}
              </div>

              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400 capitalize">{user.gender}</p>

              <div className="flex justify-center sm:justify-start gap-4 text-sm mt-2">
                <button onClick={() => setShowFollowers(true)} className="hover:underline">
                  {user.followers.length} followers
                </button>
                <button onClick={() => setShowFollowings(true)} className="hover:underline">
                  {user.followings.length} following
                </button>
              </div>

              {user._id !== loggedInUser._id && (
                <button
                  onClick={followHandler}
                  className={`mt-4 btn-primary ${
                    followed ? "bg-red-500 hover:bg-red-600" : ""
                  }`}
                >
                  {followed ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="glass p-3 flex justify-center gap-10">
            {["post", "reel"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`font-semibold ${
                  tab === t ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {t === "post" ? "Posts" : "Reels"}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          {tab === "post" &&
            (myPosts.length ? (
              myPosts.map((p) => (
                <PostCard key={p._id} value={p} type="post" />
              ))
            ) : (
              <div className="glass p-6 text-center text-gray-400">
                No posts yet
              </div>
            ))}

          {tab === "reel" &&
            (myReels.length ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <PostCard
                  value={myReels[reelIndex]}
                  type="reel"
                  key={myReels[reelIndex]._id}
                />

                <div className="flex sm:flex-col gap-4">
                  {reelIndex > 0 && (
                    <button onClick={prevReel} className="btn-primary rounded-full p-3">
                      <FaArrowUp />
                    </button>
                  )}
                  {reelIndex < myReels.length - 1 && (
                    <button onClick={nextReel} className="btn-primary rounded-full p-3">
                      <FaArrowDownLong />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass p-6 text-center text-gray-400">
                No reels yet
              </div>
            ))}
        </div>
      </div>

      {/* Modals */}
      {showFollowers && (
        <Modal value={followersData} title="Followers" setShow={setShowFollowers} />
      )}
      {showFollowings && (
        <Modal value={followingsData} title="Followings" setShow={setShowFollowings} />
      )}
    </div>
  );
};

export default UserAccount;
