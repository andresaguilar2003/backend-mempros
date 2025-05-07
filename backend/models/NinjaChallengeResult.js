const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionNumber: Number,
  correctOptions: [String],
  selectedOptions: [String],
  correctCount: Number,
  incorrectCount: Number
});

const NinjaChallengeResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  results: [answerSchema]
});

module.exports = mongoose.model('NinjaChallengeResult', NinjaChallengeResultSchema);
