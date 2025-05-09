const mongoose = require('mongoose');

const DailyUsageLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  minutesUsed: { type: Number, default: 0 }
});

DailyUsageLogSchema.index({ user: 1, date: 1 }, { unique: true }); // Previene duplicados por día

module.exports = mongoose.model('DailyUsageLog', DailyUsageLogSchema);
