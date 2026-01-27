// 🚨 MUST BE FIRST — ENV BOOTSTRAP (ESM SAFE)
import "dotenv/config";

/* =========================
   Core Imports
   ========================= */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

/* =========================
   Internal Modules
   ========================= */
import { connectDb } from "./database/db.js";
import { Chat } from "./models/ChatModel.js";
import { User } from "./models/userModel.js";
import { isAuth } from "./middlewares/isAuth.js";
import { initSocket } from "./socket/socket.js";

/* =========================
   App Initialization
   ========================= */
const app = express();
const server = initSocket(app);

/* =========================
   Cloudinary Configuration
   ========================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   Global Middlewares
   ========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   CORS CONFIG — FIXED
   ========================= */
const allowedOrigins = [
  "https://mern-social-frontend-s25k.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // MUST echo origin
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


/* =========================
   Core API Routes
   ========================= */

// Fetch chats for logged-in user
app.get("/api/messages/chats", isAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name profilePic",
    });

    chats.forEach((chat) => {
      chat.users = chat.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all users (search enabled)
app.get("/api/user/all", isAuth, async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   Modular Route Binding
   ========================= */
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

/* =========================
   Health Check
   ========================= */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* =========================
   Server Bootstrap
   ========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Backend service running on port ${PORT}`);
});
