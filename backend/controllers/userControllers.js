import TryCatch from "../utils/Trycatch.js";
import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

export const followandUnfollowUser = TryCatch(async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (targetUser._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const isFollowing = targetUser.followers.some(
    (id) => id.toString() === loggedInUser._id.toString()
  );

  if (isFollowing) {
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== loggedInUser._id.toString()
    );
    loggedInUser.followings = loggedInUser.followings.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );

    await targetUser.save();
    await loggedInUser.save();

    return res.json({ message: "User unfollowed" });
  }

  targetUser.followers.push(loggedInUser._id);
  loggedInUser.followings.push(targetUser._id);

  await targetUser.save();
  await loggedInUser.save();

  res.json({ message: "User followed" });
});

export const userFollowerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    followers: user.followers,
    followings: user.followings,
  });
});

export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.file) {
    const fileUrl = getDataUrl(req.file);

    if (user.profilePic?.id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    user.profilePic = {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();

  res.json({ message: "Profile updated" });
});

export const updatePassword = TryCatch(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect old password" });
  }

  user.password = newPassword; // model hashes it
  await user.save();

  res.json({ message: "Password updated" });
});
