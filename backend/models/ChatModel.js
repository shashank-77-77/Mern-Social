import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    latestMessage: {
      text: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

chatSchema.index({ users: 1, updatedAt: -1 });

export const Chat = mongoose.model("Chat", chatSchema);
