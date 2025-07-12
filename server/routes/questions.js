const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Question = require("../modules/Question");

// POST /api/questions - Create a new question
router.post("/", auth, async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description || !tags || tags.length === 0) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const question = new Question({
      title,
      description,
      tags,
      userId: req.user.userId,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to post question", error: err.message });
  }
});

// GET /api/questions - Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }).populate("userId", "username");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

module.exports = router;
