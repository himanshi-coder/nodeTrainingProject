const express = require('express');
const { addProperty, editProperty, getAllProperties } = require('../controllers/propertyController');
const { addAmenity, addCategory, getAllAmenities, getAllCategories } = require('../Controllers/amenityCategoryController');
const router = express.Router();

// Route to add a new property
router.post('/properties', addProperty);
// Route to display all properties
router.get('/properties', getAllProperties); // Add the GET route for fetching properties

// Route to edit property information
router.put('/properties/:id', editProperty);

// Route to add a new amenity
router.post('/amenities', addAmenity);
// Route to get all amenities with pagination
router.get('/amenities', getAllAmenities); // Add the GET route for fetching amenities

// Route to add a new category
router.post('/categories', addCategory);
router.get('/categories', getAllCategories); 

module.exports = router;