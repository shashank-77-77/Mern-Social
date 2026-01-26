import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  followandUnfollowUser,
  myProfile,
  updatePassword,
  updateProfile,
  userFollowerandFollowingData,
  userProfile,
} from "../controllers/userControllers.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

// self
router.get("/me", isAuth, myProfile);
router.put("/update-password", isAuth, updatePassword);

// follow system
router.post("/follow/:id", isAuth, followandUnfollowUser);
router.get("/followdata/:id", isAuth, userFollowerandFollowingData);

// user profiles
router.get("/:id", isAuth, userProfile);
router.put("/:id", isAuth, uploadFile, updateProfile);

export default router;
