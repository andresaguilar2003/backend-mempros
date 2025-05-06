const express = require('express');
const router = express.Router();
const MemoryGame = require('../models/MemoryGameSession');
const authMiddleware = require('../middleware/authMiddleware');

// Guardar resultado del juego "Cambio de Criterio"
router.post('/cambio-criterio', authMiddleware, async (req, res) => {
    const { score, correctSelections, incorrectSelections, totalRounds, timeTaken } = req.body;

    try {
        const newGame = new MemoryGame({
            userId: req.user.id,
            gameType: 'cambio_criterio',
            score,
            correctSelections,
            incorrectSelections,
            totalRounds,
            timeTaken,
        });

        await newGame.save();
        res.status(201).json({ message: 'Resultado guardado correctamente', game: newGame });
    } catch (error) {
        console.error('Error al guardar resultado:', error);
        res.status(500).json({ error: 'Error al guardar el resultado del juego' });
    }
});

// Ruta protegida para guardar una sesión del juego de memoria
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { timeTaken } = req.body;

    const newSession = new MemoryGameSession({
      userId: req.user.userId, // utilizas el userId del token verificado
      timeTaken,
    });

    await newSession.save();
    res.status(201).json({ message: "Partida guardada exitosamente", session: newSession });
  } catch (error) {
    console.error("❌ Error al guardar sesión de juego:", error);
    res.status(500).json({ message: "Error al guardar sesión" });
  }
});

module.exports = router;
