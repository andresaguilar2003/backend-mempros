// models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // ejemplo: 'first-task'
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // nombre de emoji, imagen, etc.
});

module.exports = mongoose.model("Achievement", achievementSchema);
