const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
} = require('../controllers/complaintController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Tenant — file a complaint
router.post('/', protect, authorize('tenant'), createComplaint);

// Tenant — view own complaints
router.get('/my', protect, authorize('tenant'), getMyComplaints);

// Admin — view all complaints
router.get('/', protect, authorize('admin'), getAllComplaints);

// Tenant (own) / Admin — view single complaint
router.get('/:id', protect, getComplaintById);

// Admin — update complaint status
router.put('/:id/status', protect, authorize('admin'), updateStatus);

module.exports = router;