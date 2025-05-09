const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  saveColorChallengeResult,
  getUserColorChallengeResults
} = require('../utils/colorChallengeController');

const ColorChallengeResult = require('../models/ColorChallengeResult'); // <- ESTA LÍNEA FALTABA

router.post('/save', authMiddleware, saveColorChallengeResult);

router.get('/my-results', authMiddleware, getUserColorChallengeResults);

// Ruta pública para obtener los resultados de cualquier usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const results = await ColorChallengeResult.find({ user: req.params.userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados por ID.' });
  }
});

module.exports = router;
