import express from "express";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

/* ======================================================
   AI SUGGEST (Typing Intelligence)
====================================================== */
router.post("/suggest", isAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 3) {
    return res.json([]);
  }

  // Simple deterministic suggestions (safe baseline)
  const suggestions = [
    `Got it 👍 ${text}`,
    `Sure, ${text} 😊`,
    `Hey! ${text}`,
  ];

  res.json(suggestions);
});

/* ======================================================
   AI IMPROVE (Message Rewrite)
====================================================== */
router.post("/improve", isAuth, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  // Clean professional rewrite (no AI dependency yet)
  const improved =
    text.charAt(0).toUpperCase() +
    text.slice(1).trim() +
    ".";

  res.json({ text: improved });
});

export default router;
