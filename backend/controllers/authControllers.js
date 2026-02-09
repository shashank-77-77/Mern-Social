import { User } from "../models/userModel.js";
import TryCatch from "../utils/Trycatch.js";
import generateToken from "../utils/generateToken.js";
import getDataUrl from "../utils/urlGenrator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

/* =========================================================
   REGISTER USER (LOCAL AUTH)
========================================================= */
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password, gender } = req.body;
  const file = req.file;

  if (!name || !email || !password || !gender || !file) {
    return res.status(400).json({ message: "Please give all values" });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User Already Exist" });
  }

  if (password.length < 7 || password.length > 10) {
    return res.status(400).json({
      message: "Password must be between 7 and 10 characters",
    });
  }

  const fileUrl = getDataUrl(file);
  const hashPassword = await bcrypt.hash(password, 10);
  const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  user = await User.create({
    name,
    email,
    password: hashPassword,
    gender,
    authProvider: "local",
    profilePic: {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  generateToken(user._id, res);

  res.status(201).json({
    message: "User Registered",
    user,
  });
});

/* =========================================================
   LOGIN USER (LOCAL AUTH ONLY)
========================================================= */
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  /* 🚫 BLOCK GOOGLE USERS FROM PASSWORD LOGIN */
  if (user.authProvider === "google") {
    return res.status(400).json({
      message: "This account uses Google sign-in. Please continue with Google.",
    });
  }

  /* ✅ PASSWORD IS GUARANTEED TO EXIST */
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  generateToken(user._id, res);

  res.json({
    message: "User Logged in",
    user,
  });
});

/* =========================================================
   LOGOUT USER
========================================================= */
export const logoutUser = TryCatch((req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    message: "Logged out successfully",
  });
});
