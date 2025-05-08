// models/Therapist.js
const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String }, // opcional
  code: { type: String, required: true }, // para validar acceso (ej. "SECRETO123")
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // pacientes
});

module.exports = mongoose.model('Therapist', therapistSchema);
