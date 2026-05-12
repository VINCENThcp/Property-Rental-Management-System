const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyControllers');

// Route to get all available properties
// URL: GET /api/properties
router.get('/', propertyController.getProperties);

// Route to add a new property
// URL: POST /api/properties
router.post('/', propertyController.addProperty);

module.exports = router;