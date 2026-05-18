const express = require('express');
const router = express.Router();

const {
    createReview,
    getReviewById,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const {protect} = require('../middlewares/authMiddleware');
const { getReviewByProperty } = require('../services/reviewService');

// Public Access
router.get('/property/:propertyId', getReviewByProperty);
router.get('/:id', getReviewById);

// Logged Access
router.post('/', protect, createReview);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);


module.exports = router;