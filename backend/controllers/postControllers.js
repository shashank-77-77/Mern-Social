import { Post } from "../models/postModel.js";
import TryCatch from "../utils/Trycatch.js";
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";

export const newPost = TryCatch(async (req, res) => {
  const { caption } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Post file is required" });
  }

  const type = req.query.type || "post";
  const options =
    type === "reel" ? { resource_type: "video" } : {};

  const fileUrl = getDataUrl(file);
  const myCloud = await cloudinary.v2.uploader.upload(
    fileUrl.content,
    options
  );

  const post = await Post.create({
    caption,
    post: {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: req.user._id,
    type,
  });

  res.status(201).json({ message: "Post created", post });
});

export const deletePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await cloudinary.v2.uploader.destroy(post.post.id, {
    resource_type: post.type === "reel" ? "video" : "image",
  });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

export const getAllPosts = TryCatch(async (req, res) => {
  const populateConfig = [
    { path: "owner", select: "-password" },
    { path: "comments.user", select: "-password" },
  ];

  const posts = await Post.find({ type: "post" })
    .sort({ createdAt: -1 })
    .populate(populateConfig);

  const reels = await Post.find({ type: "reel" })
    .sort({ createdAt: -1 })
    .populate(populateConfig);

  res.json({ posts, reels });
});

export const likeUnlikePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const userId = req.user._id.toString();
  const index = post.likes.findIndex(
    (id) => id.toString() === userId
  );

  if (index >= 0) {
    post.likes.splice(index, 1);
    await post.save();
    return res.json({ message: "Post unliked" });
  }

  post.likes.push(req.user._id);
  await post.save();
  res.json({ message: "Post liked" });
});

export const commentOnPost = TryCatch(async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await post.save();
  res.json({ message: "Comment added" });
});

export const deleteComment = TryCatch(async (req, res) => {
  const { commentId } = req.query;
  if (!commentId) {
    return res.status(400).json({ message: "commentId is required" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const index = post.comments.findIndex(
    (c) => c._id.toString() === commentId
  );

  if (index === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const comment = post.comments[index];

  if (
    post.owner.toString() !== req.user._id.toString() &&
    comment.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  post.comments.splice(index, 1);
  await post.save();
  res.json({ message: "Comment deleted" });
});

export const editCaption = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  post.caption = req.body.caption;
  await post.save();
  res.json({ message: "Post updated" });
});
