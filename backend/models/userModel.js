import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // Only required for local auth users
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false, // security hardening
    },

    // Google OAuth identifier
    googleId: {
      type: String,
      index: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Unified avatar strategy
    avatar: {
      type: String,
    },

    // Optional: if you use Cloudinary or similar
    profilePic: {
      id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev / hot reload
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
export { User };
