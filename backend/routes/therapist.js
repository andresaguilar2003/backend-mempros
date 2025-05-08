// routes/therapist.js
const express = require('express');
const router = express.Router();
const { getTherapistsByCode } = require('../utils/therapistController');

// GET /api/therapists/by-code/SECRETO123
router.get('/by-code/:code', getTherapistsByCode);

module.exports = router;
