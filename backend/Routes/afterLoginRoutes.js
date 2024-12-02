const express = require('express');
const { authenticateJWT } = require('../Middlewares/jwtVerificationMiddleware');
const router = express.Router()

// Home page API
router.get('/api/home', authenticateJWT, (req, res) => {
    // Fetch rental properties or any other required data
    res.status(200).json({
      user: req.user, // Send user details from JWT if needed
      properties: rentalProperties, // Send rental properties data
      message: 'Welcome to the Rental Properties App!',
    });
});

module.exports = router