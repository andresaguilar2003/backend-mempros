const mongoose = require('mongoose');

const PMCQSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  date: { type: Date, default: Date.now },

  // 35 respuestas tipo Likert (0–3)
  responses: {
    type: [Number],
    validate: [arr => arr.length === 35, 'Se requieren exactamente 35 respuestas'],
    required: true
  },

  // Tarea posterior
  favoriteActivities: {
    type: [String],
    validate: [arr => arr.length === 3, 'Se requieren exactamente 3 actividades'],
    required: true
  },
  favoriteShowsOrMovies: {
    type: [String],
    validate: [arr => arr.length === 3, 'Se requieren exactamente 3 series o películas'],
    required: true
  },
  emojiActivity: { type: String, required: true },  // puede ser cualquier emoji
  emojiMedia: { type: String, required: true }      // lo mismo

});

module.exports = mongoose.model('PMCQResult', PMCQSchema);
