const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description:{ type: String, required: true },
  votes:      { type: Number, default: 0 },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("Answer", answerSchema);
