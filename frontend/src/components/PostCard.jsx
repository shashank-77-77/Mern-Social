import React, { useEffect, useState } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { SocketData } from "../context/SocketContext";

import SimpleModal from "./SimpleModal";
import LikeModal from "./LikeModal";
import { LoadingAnimation } from "./Loading";

/* ===========================
   PostCard Component
   =========================== */

const PostCard = ({ type, value }) => {
  const { user } = UserData();
  const { likePost, addComment, deletePost, loading, fetchPosts } = PostData();
  const { onlineUsers } = SocketData();

  const [isLike, setIsLike] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [openLikes, setOpenLikes] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [caption, setCaption] = useState(value.caption || "");
  const [captionLoading, setCaptionLoading] = useState(false);

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  /* ---------- Sync Like State ---------- */
  useEffect(() => {
    const liked = value.likes.some((id) => id === user._id);
    setIsLike(liked);
  }, [value.likes, user._id]);

  /* ---------- Like ---------- */
  const likeHandler = () => {
    likePost(value._id);
  };

  /* ---------- Comment ---------- */
  const addCommentHandler = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(value._id, comment, setComment, setShowComments);
  };

  /* ---------- Delete ---------- */
  const deleteHandler = () => {
    deletePost(value._id);
  };

  /* ---------- Update Caption ---------- */
  const updateCaption = async () => {
    if (!caption.trim()) return;

    setCaptionLoading(true);
    try {
      const { data } = await axios.put(
        "/api/post/" + value._id,
        { caption }
      );

      toast.success(data.message);
      await fetchPosts();
      setShowInput(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setCaptionLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center pt-3 pb-14">
      {/* ---------- Owner Modal ---------- */}
      <SimpleModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setShowModal(false);
              setShowInput(true);
            }}
            className="bg-blue-400 text-white py-1 px-3 rounded-md"
          >
            Edit
          </button>

          <button
            onClick={deleteHandler}
            className="bg-red-400 text-white py-1 px-3 rounded-md"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </SimpleModal>

      {/* ---------- Likes Modal ---------- */}
      <LikeModal
        isOpen={openLikes}
        onClose={() => setOpenLikes(false)}
        likes={value.likes}
      />

      {/* ---------- Card ---------- */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Link
            to={`/user/${value.owner._id}`}
            className="flex items-center gap-2"
          >
            <img
              src={value.owner.profilePic?.url}
              alt=""
              className="w-8 h-8 rounded-full"
            />

            {onlineUsers.includes(value.owner._id) && (
              <span className="w-2 h-2 bg-green-400 rounded-full" />
            )}

            <div>
              <p className="font-semibold">{value.owner.name}</p>
              <p className="text-sm text-gray-500">{formatDate}</p>
            </div>
          </Link>

          {value.owner._id === user._id && (
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto text-xl"
            >
              <BsThreeDotsVertical />
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="my-2">
          {showInput ? (
            <div className="flex gap-2 items-center">
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="custom-input"
              />
              <button
                onClick={updateCaption}
                disabled={captionLoading}
              >
                {captionLoading ? <LoadingAnimation /> : "Save"}
              </button>
              <button onClick={() => setShowInput(false)}>X</button>
            </div>
          ) : (
            <p>{value.caption}</p>
          )}
        </div>

        {/* Media */}
        {type === "post" ? (
          <img
            src={value.post.url}
            alt=""
            className="rounded-md"
          />
        ) : (
          <video
            src={value.post.url}
            controls
            className="rounded-md"
          />
        )}

        {/* Actions */}
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-2">
            <span
              onClick={likeHandler}
              className="cursor-pointer text-2xl text-red-500"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>

            <button onClick={() => setOpenLikes(true)}>
              {value.likes.length} likes
            </button>
          </div>

          <button
            onClick={() => setShowComments((p) => !p)}
            className="flex items-center gap-2"
          >
            <BsChatFill />
            {value.comments.length}
          </button>
        </div>

        {/* Add Comment */}
        {showComments && (
          <form onSubmit={addCommentHandler} className="flex gap-2 mt-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="custom-input"
              placeholder="Add comment"
            />
            <button type="submit">Add</button>
          </form>
        )}

        {/* Comments */}
        <div className="mt-2 max-h-[200px] overflow-y-auto">
          {value.comments.length > 0 ? (
            value.comments.map((c) => (
              <Comment
                key={c._id}
                value={c}
                user={user}
                owner={value.owner._id}
                id={value._id}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

/* ===========================
   Comment Component
   =========================== */

export const Comment = ({ value, user, owner, id }) => {
  const { deleteComment } = PostData();

  return (
    <div className="flex gap-2 mt-2 items-center">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic?.url}
          className="w-6 h-6 rounded-full"
          alt=""
        />
      </Link>

      <div>
        <p className="font-semibold text-sm">{value.user.name}</p>
        <p className="text-sm text-gray-600">{value.comment}</p>
      </div>

      {(owner === user._id || value.user._id === user._id) && (
        <button
          onClick={() => deleteComment(id, value._id)}
          className="text-red-500 ml-auto"
        >
          <MdDelete />
        </button>
      )}
    </div>
  );
};
