const mongoose = require('mongoose');

const memoryGameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: { type: String, enum: ['memoria_basica', 'cambio_criterio'], required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    // Campos específicos del nuevo juego
    correctSelections: { type: Number }, // correctas en total
    incorrectSelections: { type: Number }, // errores cometidos
    totalRounds: { type: Number }, // cantidad de turnos que se jugaron
    timeTaken: { type: Number }, // en segundos (opcional)
});

module.exports = mongoose.model('MemoryGame', memoryGameSchema);
