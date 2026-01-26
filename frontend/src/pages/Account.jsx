import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const Account = ({ user }) => {
  const navigate = useNavigate();
  const {
    logoutUser,
    updateProfilePic,
    updateProfileName,
  } = UserData();

  const { posts, reels, loading } = PostData();

  if (loading) return <Loading />;

  /* ---------- My Content ---------- */
  const myPosts = posts.filter(
    (p) => p.owner._id.toString() === user._id
  );
  const myReels = reels.filter(
    (r) => r.owner._id.toString() === user._id
  );

  /* ---------- Logout ---------- */
  const logoutHandler = () => logoutUser(navigate);

  /* ---------- Followers / Followings ---------- */
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const { data } = await api.get(
          `/api/user/followdata/${user._id}`
        );
        setFollowersData(data.followers);
        setFollowingsData(data.followings);
      } catch {
        toast.error("Failed to load follow data");
      }
    };
    fetchFollowData();
  }, [user._id]);

  /* ---------- Profile Image ---------- */
  const [file, setFile] = useState(null);

  const changeFileHandler = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const updateImageHandler = () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    const formdata = new FormData();
    formdata.append("file", file);
    updateProfilePic(user._id, formdata, setFile);
  };

  /* ---------- Name Update ---------- */
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user.name || "");

  const updateNameHandler = () =>
    updateProfileName(user._id, name, setShowInput);

  /* ---------- Password Update ---------- */
  const [showUpdatePass, setShowUpdatePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        `/api/user/${user._id}`,
        { oldPassword, newPassword }
      );
      toast.success(data.message);
      setOldPassword("");
      setNewPassword("");
      setShowUpdatePass(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Password update failed"
      );
    }
  };

  /* ---------- Reels Navigation ---------- */
  const [index, setIndex] = useState(0);
  const prevReel = () => index > 0 && setIndex(index - 1);
  const nextReel = () =>
    index < myReels.length - 1 && setIndex(index + 1);

  const [type, setType] = useState("post");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center gap-4 pt-3 pb-14">
      {showFollowers && (
        <Modal
          value={followersData}
          title="Followers"
          setShow={setShowFollowers}
        />
      )}
      {showFollowings && (
        <Modal
          value={followingsData}
          title="Followings"
          setShow={setShowFollowings}
        />
      )}

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full flex gap-4">
        <div>
          <img
            src={user.profilePic.url}
            className="w-[180px] h-[180px] rounded-full"
            alt=""
          />
          <input type="file" onChange={changeFileHandler} />
          <button
            onClick={updateImageHandler}
            className="bg-blue-500 text-white px-3 py-2 mt-2"
          >
            Update Profile
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {showInput ? (
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="custom-input"
              />
              <button onClick={updateNameHandler}>Save</button>
              <button onClick={() => setShowInput(false)}>X</button>
            </div>
          ) : (
            <p className="font-semibold">
              {user.name}{" "}
              <button onClick={() => setShowInput(true)}>
                <CiEdit />
              </button>
            </p>
          )}

          <p>{user.email}</p>
          <p>{user.gender}</p>
          <p onClick={() => setShowFollowers(true)}>
            {user.followers.length} followers
          </p>
          <p onClick={() => setShowFollowings(true)}>
            {user.followings.length} following
          </p>

          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password */}
      <button
        onClick={() => setShowUpdatePass(!showUpdatePass)}
        className="bg-blue-500 text-white px-3 py-1"
      >
        {showUpdatePass ? "Cancel" : "Update Password"}
      </button>

      {showUpdatePass && (
        <form
          onSubmit={updatePassword}
          className="bg-white p-4 rounded-md flex flex-col gap-3"
        >
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="bg-blue-500 text-white">
            Update Password
          </button>
        </form>
      )}

      {/* Toggle */}
      <div className="bg-white p-4 rounded-md flex gap-6">
        <button onClick={() => setType("post")}>Posts</button>
        <button onClick={() => setType("reel")}>Reels</button>
      </div>

      {/* Content */}
      {type === "post" &&
        (myPosts.length ? (
          myPosts.map((p) => (
            <PostCard key={p._id} value={p} type="post" />
          ))
        ) : (
          <p>No posts yet</p>
        ))}

      {type === "reel" &&
        (myReels.length ? (
          <div className="flex gap-4 items-center">
            <PostCard
              value={myReels[index]}
              type="reel"
            />
            <div className="flex flex-col gap-4">
              {index > 0 && (
                <button onClick={prevReel}>
                  <FaArrowUp />
                </button>
              )}
              {index < myReels.length - 1 && (
                <button onClick={nextReel}>
                  <FaArrowDownLong />
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>No reels yet</p>
        ))}
    </div>
  );
};

export default Account;
