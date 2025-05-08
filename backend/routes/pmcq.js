const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  savePMCQResult,
  getPMCQResult,
} = require('../utils/pmcqController');

// Ruta para guardar resultados (solo una vez)
router.post('/submit', authMiddleware, savePMCQResult);

// Ruta para consultar si ya ha respondido
router.get('/result', authMiddleware, getPMCQResult);

module.exports = router;
