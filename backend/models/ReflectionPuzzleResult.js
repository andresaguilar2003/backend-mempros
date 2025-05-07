const mongoose = require('mongoose');

const ReflectionPuzzleResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

module.exports = mongoose.model('ReflectionPuzzleResult', ReflectionPuzzleResultSchema);
