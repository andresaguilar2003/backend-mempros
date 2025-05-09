const express = require('express');
const router = express.Router();
const { saveNinjaChallengeResult, getUserNinjaChallengeResults } = require('../utils/ninjaChallengeController');
const authMiddleware = require('../middleware/authMiddleware');
const NinjaChallengeResult = require('../models/NinjaChallengeResult');

router.post('/save', authMiddleware, saveNinjaChallengeResult);
router.get('/my-results', authMiddleware, getUserNinjaChallengeResults);
router.get('/user/:userId', async (req, res) => {
    try {
      const results = await NinjaChallengeResult.find({ user: req.params.userId }).sort({ date: -1 });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener resultados por ID.' });
    }
  });

module.exports = router;
