import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

const Home = () => {
  const { posts, loading } = PostData();

  if (loading) return <Loading />;

  return (
    <div>
      <AddPost type="post" />

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post._id} value={post} type="post" />
        ))
      ) : (
        <p className="text-center mt-4 text-gray-500">
          No posts yet. Be the first to post!
        </p>
      )}
    </div>
  );
};

export default Home;
