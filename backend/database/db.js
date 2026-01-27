// 🔐 ENV GUARANTEE — NEVER ASSUME BOOTSTRAP ORDER
import "dotenv/config";
import mongoose from "mongoose";

export const connectDb = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined");
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
