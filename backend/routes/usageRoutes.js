const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { updateUsage, getUsage } = require('../utils/usageController');

router.post('/update', authMiddleware, updateUsage);
router.get('/get', authMiddleware, getUsage); 

module.exports = router;
