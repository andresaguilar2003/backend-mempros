const express = require('express');
const router = express.Router();
const { saveNinjaPathResult, getUserNinjaPathResults } = require('../utils/ninjaPathController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, saveNinjaPathResult);
router.get('/my-results', authMiddleware, getUserNinjaPathResults);

module.exports = router;
