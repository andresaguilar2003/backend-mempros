// routes/therapist.js
const express = require('express');
const router = express.Router();
const { getTherapistsByCode,getTherapistWithUsers } = require('../utils/therapistController');

// GET /api/therapists/by-code/SECRETO123
router.get('/by-code/:code', getTherapistsByCode);

router.get('/:id/patients', getTherapistWithUsers);

module.exports = router;
