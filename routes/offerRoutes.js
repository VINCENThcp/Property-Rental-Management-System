const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// 1. Create offer (Tenant)
router.post('/', protect, authorize('tenant'), offerController.makeOffer);

// 2. Tenant viewing their own offers
router.get('/my-offers', protect, authorize('tenant'), offerController.getMyOffers);
router.get('/tenant/:tenantId', offerController.getMyOffers); 

// 3. Admin viewing all offers
router.get('/admin/all', protect, authorize('tenant'), offerController.getAdminOffers);

// 4. Landlord accepting/rejecting an offer
router.put('/:offerId/status', protect, authorize('tenant'), offerController.respondToOffer);

// Existing route for property offers
router.get('/property/:propertyId', protect, authorize('tenant'), offerController.getPropertyOffers);

module.exports = router;