const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updateUsage, getUsage } = require('../utils/usageController');
const DailyUsageLog = require('../models/DailyUsageLog');

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await DailyUsageLog.find({ user: userId }).sort({ date: -1 });

    if (!history.length) {
      return res.status(404).json({ message: 'No hay historial de uso.' });
    }

    res.json(history);
  } catch (err) {
    console.error('Error al obtener historial:', err);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});


router.post('/update', authMiddleware, updateUsage);
router.get('/get', authMiddleware, getUsage); 

module.exports = router;
