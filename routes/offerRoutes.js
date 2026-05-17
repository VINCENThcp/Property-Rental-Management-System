const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// 1. Create offer (Tenant)
router.post('/', offerController.makeOffer);

// 2. Tenant viewing their own offers
// (Uses /my-offers, or /tenant/:tenantId if testing without tokens)
router.get('/my-offers', offerController.getMyOffers);
router.get('/tenant/:tenantId', offerController.getMyOffers); 

// 3. Admin viewing all offers
router.get('/admin/all', offerController.getAdminOffers);

// 4. Landlord accepting/rejecting an offer
router.patch('/:offerId/status', offerController.respondToOffer);

// Existing route for property offers
router.get('/property/:propertyId', offerController.getPropertyOffers);

module.exports = router;