// server/routes/answers.js

const express = require("express");
const router = express.Router();

const Answer = require("../modules/Answer");
const Question = require("../modules/Question");
const auth = require("../middleware/authMiddleware");

// GET /api/answers/:questionId — fetch all answers for a question
router.get("/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    return res.json(answers);
  } catch (err) {
    console.error("Fetch Answers Error:", err);
    return res.status(500).json({ message: "Failed to fetch answers", error: err.message });
  }
});

// POST /api/answers/:questionId — submit a new answer
router.post("/:questionId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Answer content cannot be empty" });
    }

    // Ensure the question exists
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Create and save the answer
    const answer = new Answer({
      questionId: req.params.questionId,
      userId: req.user.userId,
      content: content.trim(),
    });
    await answer.save();

    return res.status(201).json(answer);
  } catch (err) {
    console.error("Save Answer Error:", err);
    return res.status(500).json({ message: "Failed to save answer", error: err.message });
  }
});

module.exports = router;
