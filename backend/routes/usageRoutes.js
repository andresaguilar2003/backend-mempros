const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updateUsage } = require('../utils/usageController');

router.post('/update', authMiddleware, updateUsage);

module.exports = router;
