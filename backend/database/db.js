import mongoose from "mongoose";

export const connectDb = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URL is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "mernsocial",
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
