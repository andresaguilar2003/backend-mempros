const express = require('express');
const router = express.Router();
const { saveReflectionPuzzleResult, getUserReflectionPuzzleResults } = require('../utils/reflectionPuzzleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, saveReflectionPuzzleResult);
router.get('/my-results', authMiddleware, getUserReflectionPuzzleResults);

module.exports = router;
