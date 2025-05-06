const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  level: Number,
  errors: Number
});

const ColorChallengeResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  highestLevel: { type: Number, required: true },
  errorsPerLevel: [errorSchema]
});

module.exports = mongoose.model('ColorChallengeResult', ColorChallengeResultSchema);
