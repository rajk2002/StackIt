const Answer = require("../models/Answer");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

router.post("/:questionId", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Answer content cannot be empty" });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = new Answer({
      questionId: req.params.questionId,
      userId: req.user.id,
      content,
    });

    await answer.save();
    res.status(201).json({ message: "Answer saved", answer });
  } catch (err) {
    console.error("Save Answer Error:", err);
    res.status(500).json({ message: "Failed to save answer", error: err.message });
  }
});

module.exports = router;
