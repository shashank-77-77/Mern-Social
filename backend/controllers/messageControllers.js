import { Chat } from "../models/ChatModel.js";
import { Message } from "../models/messages.js";
import { getReciverSocketId, io } from "../socket/socket.js";
import TryCatch from "../utils/Trycatch.js";

// Send a message from sender to receiver
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

  await chat.updateOne({
    latestMessage: {
      text: message,
      sender: senderId,
      createdAt: newMessage.createdAt,
    },
  });

  const receiverSocketId = getReciverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      chatId: chat._id,
      message: newMessage,
    });
  }

  res.status(201).json(newMessage);
});

export const getAllMessages = TryCatch(async (req, res) => {
  const { id } = req.params; // other user's id (per current route design)
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
