import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

import PostCard from "../components/PostCard";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";

import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

/* =========================================================
   ACCOUNT (ENHANCED UI – SAFE)
   ========================================================= */
const Account = ({ user }) => {
  const navigate = useNavigate();

  const {
    logoutUser,
    updateProfilePic,
    updateProfileName,
  } = UserData();

  const { posts = [], reels = [], loading } = PostData();

  /* ===============================
     PARALLAX EFFECT
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 60}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 60}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     STATE (UNCHANGED)
     =============================== */
  const [tab, setTab] = useState("post");
  const [reelIndex, setReelIndex] = useState(0);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  const [file, setFile] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
     HANDLERS (UNCHANGED)
     =============================== */
  const logoutHandler = () => logoutUser(navigate);
  const changeFileHandler = (e) => setFile(e.target.files[0]);

  const changeImageHandler = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    updateProfilePic(user._id, formData, setFile);
  };

  const updateNameHandler = () => {
    if (!name.trim()) return;
    updateProfileName(user._id, name, setEditingName);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${user._id}`, {
        oldPassword,
        newPassword,
      });
      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Password update failed"
      );
    }
  };

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
      {/* Parallax */}
      <div className="parallax" />

      {/* Floating Icons */}
      <div className="floating-icons">
        <FaFacebookF className="floating-icon text-blue-500 text-4xl" style={{ left: "10%" }} />
        <FaInstagram className="floating-icon text-pink-500 text-4xl" style={{ left: "30%", animationDelay: "6s" }} />
        <FaTwitter className="floating-icon text-sky-400 text-4xl" style={{ left: "60%", animationDelay: "12s" }} />
        <FaLinkedin className="floating-icon text-blue-400 text-4xl" style={{ left: "85%", animationDelay: "18s" }} />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* PROFILE CARD */}
          <div className="glass p-6 flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={user.profilePic.url}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-cyan-400"
              />
              <input type="file" onChange={changeFileHandler} />
              <button onClick={changeImageHandler} className="btn-primary text-sm">
                Update Profile
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    className="custom-input flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button onClick={updateNameHandler} className="btn-primary text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="text-sm text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <button onClick={() => setEditingName(true)}>
                    <CiEdit />
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400 capitalize">{user.gender}</p>

              <div className="flex gap-4 text-sm">
                <button onClick={() => setShowFollowers(true)} className="hover:underline">
                  {user.followers.length} followers
                </button>
                <button onClick={() => setShowFollowings(true)} className="hover:underline">
                  {user.followings.length} following
                </button>
              </div>

              <button
                onClick={logoutHandler}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* PASSWORD */}
          <button onClick={() => setShowPasswordForm((p) => !p)} className="btn-primary">
            {showPasswordForm ? "Cancel" : "Update Password"}
          </button>

          {showPasswordForm && (
            <form onSubmit={updatePassword} className="glass p-4 space-y-3">
              <input
                type="password"
                className="custom-input"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="custom-input"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Save Password
              </button>
            </form>
          )}

          {/* TABS */}
          <div className="glass p-3 flex justify-center gap-8">
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

export default Account;
