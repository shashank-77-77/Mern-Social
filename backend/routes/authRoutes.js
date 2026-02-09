import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authControllers.js";
import { googleAuth } from "../controllers/googleAuthController.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

/* ===============================
   AUTH ROUTES
================================ */

// Email / Password
router.post("/register", uploadFile, registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Google OAuth
router.post("/google", googleAuth);

export default router;
