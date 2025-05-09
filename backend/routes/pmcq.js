const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const {
  savePMCQResult,
  getPMCQResult,
} = require('../utils/pmcqController');
const PMCQResult = require('../models/PMCQResult');


// Ruta para guardar resultados (solo una vez)
router.post('/submit', authMiddleware, savePMCQResult);

// Ruta para consultar si ya ha respondido
router.get('/result', authMiddleware, getPMCQResult);

// Nueva ruta pública (o protégela con un middleware de rol más adelante)
router.get('/result/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await PMCQResult.findOne({ user: userId });

    if (!result) {
      return res.status(404).json({ message: 'No se encontró resultado para este paciente.' });
    }

    res.json(result);
  } catch (error) {
    console.error('⛔ Error al obtener el PMCQ por ID:', error);
    res.status(500).json({ error: 'Error al obtener el informe por ID' });
  }
});


module.exports = router;
