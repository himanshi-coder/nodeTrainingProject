const express = require('express');
const router = express.Router();
const { sendRentalRequest, handleRentalRequest } = require('../Controllers/rentalRequestController');
const { authenticateJWT } = require('../Middlewares/jwtVerificationMiddleware');

// Send rental request
router.post('/request', authenticateJWT, sendRentalRequest);

// Accept/Reject rental request
router.put('/request/:id', authenticateJWT, handleRentalRequest);

module.exports = router;
