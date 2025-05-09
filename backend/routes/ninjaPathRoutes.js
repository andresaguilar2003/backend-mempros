const express = require('express');
const router = express.Router();
const { saveNinjaPathResult, getUserNinjaPathResults } = require('../utils/ninjaPathController');
const authMiddleware = require('../middleware/authMiddleware');
const NinjaPathResult = require('../models/NinjaPathResult');

router.post('/save', authMiddleware, saveNinjaPathResult);
router.get('/my-results', authMiddleware, getUserNinjaPathResults);
router.get('/user/:userId', async (req, res) => {
    try {
      const results = await NinjaPathResult.find({ user: req.params.userId }).sort({ date: -1 });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener resultados por ID.' });
    }
  });

module.exports = router;
