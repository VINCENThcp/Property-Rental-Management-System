const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// URL: POST /api/offers (To make an offer)
router.post('/', offerController.makeOffer);

// URL: GET /api/offers/property/:propertyId (To see offers for a house)
router.get('/property/:propertyId', offerController.getPropertyOffers);

module.exports = router;