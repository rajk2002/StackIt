const express = require("express");
const router = express.Router();
const Answer = require("../modules/Answer");
const Question = require("../modules/Question");
const authMiddleware = require("../middleware/authMiddleware");

// Submit an answer
router.post("/:questionId", authMiddleware, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const newAnswer = new Answer({
      questionId,
      content,
      userId,
      votes: 0,
      votedBy: [],
    });

    await newAnswer.save();

    res.status(201).json({ message: "Answer saved successfully" });
  } catch (err) {
    console.error("Save Answer Error:", err);
    res.status(500).json({ message: "Failed to save answer", error: err.message });
  }
});


// Get all answers for a question
router.get("/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate("userId", "username")
      .sort({ votes: -1 });
    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch answers" });
  }
});

// Upvote an answer
router.post('/upvote/:answerId', authMiddleware, async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user.id;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Prevent double voting
    if (answer.votedBy.includes(userId)) {
      return res.status(400).json({ message: "You have already voted for this answer" });
    }

    answer.votes += 1;
    answer.votedBy.push(userId);
    await answer.save();

    res.json({ message: "Upvoted successfully", votes: answer.votes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
