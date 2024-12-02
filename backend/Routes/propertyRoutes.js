const express = require('express');
const { addProperty, editProperty, getAllProperties } = require('../controllers/propertyController');
const { addAmenity, addCategory, getAllAmenities, getAllCategories } = require('../Controllers/amenityCategoryController');
const { authenticateJWT } = require('../Middlewares/jwtVerificationMiddleware');
const router = express.Router();

// Route to add a new property
router.post('/properties', authenticateJWT, addProperty); // protected
// Route to display all properties
router.get('/properties', getAllProperties); // Add the GET route for fetching properties

// Route to edit property information
router.put('/properties/:id', authenticateJWT, editProperty); // protected

// Route to add a new amenity
router.post('/amenities', authenticateJWT, addAmenity); // protected
// Route to get all amenities with pagination
router.get('/amenities', getAllAmenities); // Add the GET route for fetching amenities

// Route to add a new category
router.post('/categories', authenticateJWT, addCategory); // protected
router.get('/categories', getAllCategories); 

module.exports = router;