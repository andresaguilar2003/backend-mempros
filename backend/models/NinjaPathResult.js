const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  description: { type: String, required: true },
  timeframe: { type: String, required: true }, // e.g., "1 año", "5 años"
});

const NinjaPathResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  goals: [goalSchema],
  usedHelp: { type: Boolean, default: false }
});

module.exports = mongoose.model('NinjaPathResult', NinjaPathResultSchema);
