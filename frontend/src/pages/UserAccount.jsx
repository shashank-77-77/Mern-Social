import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import { Loading } from "../components/Loading";
import { UserData } from "../context/UserContext";
import Modal from "../components/Modal";
import { SocketData } from "../context/SocketContext";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const UserAccount = ({ user: loggedInUser }) => {
  const { id } = useParams();
  const { posts, reels } = PostData();
  const { followUser } = UserData();
  const { onlineUsers } = SocketData();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Profile ---------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/api/user/${id}`);
        setUser(data);
      } catch {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Loading />;
  if (!user) return null;

  /* ---------- My Content ---------- */
  const myPosts = posts.filter(
    (p) => p.owner._id.toString() === user._id
  );
  const myReels = reels.filter(
    (r) => r.owner._id.toString() === user._id
  );

  /* ---------- Follow State ---------- */
  const isFollowing = user.followers.some(
    (f) => f.toString() === loggedInUser._id
  );

  const followHandler = async () => {
    await followUser(user._id, refreshUser);
  };

  const refreshUser = async () => {
    const { data } = await api.get(`/api/user/${id}`);
    setUser(data);
  };

  /* ---------- Followers / Following ---------- */
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

  /* ---------- Reels Navigation ---------- */
  const [index, setIndex] = useState(0);
  const prevReel = () => index > 0 && setIndex(index - 1);
  const nextReel = () =>
    index < myReels.length - 1 && setIndex(index + 1);

  const [type, setType] = useState("post");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center pt-3 pb-14">
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
        <img
          src={user.profilePic?.url}
          alt=""
          className="w-[180px] h-[180px] rounded-full"
        />

        <div className="flex flex-col gap-2">
          <p className="font-semibold flex items-center gap-2">
            {user.name}
            {onlineUsers.includes(user._id) && (
              <span className="text-green-500 text-sm">
                Online
              </span>
            )}
          </p>
          <p>{user.email}</p>
          <p>{user.gender}</p>

          <p onClick={() => setShowFollowers(true)}>
            {user.followers.length} followers
          </p>
          <p onClick={() => setShowFollowings(true)}>
            {user.followings.length} following
          </p>

          {user._id !== loggedInUser._id && (
            <button
              onClick={followHandler}
              className={`py-2 px-5 text-white rounded-md ${
                isFollowing ? "bg-red-500" : "bg-blue-400"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

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

export default UserAccount;
