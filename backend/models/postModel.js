import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
    },

    post: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },

    type: {
      type: String,
      enum: ["post", "reel"],
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ owner: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
