const express = require('express');
const router = express.Router();
const { saveColorChallengeResult, getUserColorChallengeResults } = require('../utils/colorChallengeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, saveColorChallengeResult);

// Obtener los resultados del usuario para Color Challenge
router.get('/my-results', authMiddleware, getUserColorChallengeResults);

module.exports = router;
