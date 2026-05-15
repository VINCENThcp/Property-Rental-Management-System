const express = require('express');
const router = express.Router();
const {
  addProperty,
  getProperties,
  getProperty,
  editProperty,
  removeProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, authorize('landlord', 'admin'), addProperty);
router.put('/:id', protect, authorize('landlord', 'admin'), editProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), removeProperty);

module.exports = router;