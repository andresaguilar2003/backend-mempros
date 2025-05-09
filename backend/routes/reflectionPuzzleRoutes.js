const express = require('express');
const router = express.Router();
const { saveReflectionPuzzleResult, getUserReflectionPuzzleResults } = require('../utils/reflectionPuzzleController');
const authMiddleware = require('../middleware/authMiddleware');
const ReflectionPuzzleResult = require('../models/ReflectionPuzzleResult');

router.post('/save', authMiddleware, saveReflectionPuzzleResult);
router.get('/my-results', authMiddleware, getUserReflectionPuzzleResults);
router.get('/user/:userId', async (req, res) => {
    try {
      const results = await ReflectionPuzzleResult.find({ user: req.params.userId }).sort({ date: -1 });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener resultados por ID.' });
    }
  });

module.exports = router;
