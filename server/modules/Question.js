const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  tags:        [String],
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  acceptedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
