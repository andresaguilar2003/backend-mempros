const express = require('express');
const router = express.Router();
const { saveNinjaChallengeResult, getUserNinjaChallengeResults } = require('../utils/ninjaChallengeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, saveNinjaChallengeResult);
router.get('/my-results', authMiddleware, getUserNinjaChallengeResults);

module.exports = router;
