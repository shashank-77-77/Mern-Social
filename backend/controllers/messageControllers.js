import { Chat } from "../models/ChatModel.js";
import { Message } from "../models/messages.js";
import { getReciverSocketId } from "../socket/socket.js";
import TryCatch from "../utils/Trycatch.js";

/* ============================
   Send Message
   ============================ */
export const sendMessage = TryCatch(async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !message) {
    return res.status(400).json({
      message: "receiverId and message are required",
    });
  }

  let chat = await Chat.findOne({
    users: { $all: [senderId, receiverId] },
  });

  if (!chat) {
    chat = await Chat.create({
      users: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    chatId: chat._id,
    sender: senderId,
    text: message,
  });

  chat.latestMessage = {
    text: message,
    sender: senderId,
    createdAt: newMessage.createdAt,
  };
  await chat.save();

  // ✅ Correct way to access Socket.IO
  const io = req.app.get("io");
  const receiverSocketId = getReciverSocketId(receiverId);

  if (io && receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
});

/* ============================
   Get All Messages
   ============================ */
export const getAllMessages = TryCatch(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findOne({
    users: { $all: [userId, id] },
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found between these users",
    });
  }

  const messages = await Message.find({ chatId: chat._id })
    .sort({ createdAt: 1 });

  res.json(messages);
});
