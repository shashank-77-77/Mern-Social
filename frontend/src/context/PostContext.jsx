import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PostContext = createContext();

/* ---------- Axios Instance ---------- */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  /* ---------- Fetch Feed ---------- */
  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/api/post/all");
      setPosts(data.posts);
      setReels(data.reels);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Create Post / Reel ---------- */
  const addPost = async (
    formdata,
    setFile,
    setFilePrev,
    setCaption,
    type
  ) => {
    setAddLoading(true);
    try {
      const { data } = await api.post(
        `/api/post/new?type=${type}`,
        formdata
      );

      toast.success(data.message);
      await fetchPosts();
      setFile("");
      setFilePrev("");
      setCaption("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setAddLoading(false);
    }
  };

  /* ---------- Like / Unlike ---------- */
  const likePost = async (id) => {
    try {
      const { data } = await api.post(`/api/post/like/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  /* ---------- Comments ---------- */
  const addComment = async (id, comment, setComment, setShow) => {
    if (!comment) return;

    try {
      const { data } = await api.post(`/api/post/comment/${id}`, { comment });
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Comment failed");
    }
  };

  const deleteComment = async (id, commentId) => {
    try {
      const { data } = await api.delete(
        `/api/post/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ---------- Delete Post ---------- */
  const deletePost = async (id) => {
    try {
      const { data } = await api.delete(`/api/post/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ---------- Init ---------- */
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        reels,
        loading,
        addLoading,
        fetchPosts,
        addPost,
        likePost,
        addComment,
        deleteComment,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
