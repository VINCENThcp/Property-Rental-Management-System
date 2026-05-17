const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/', offerController.makeOffer);
router.get('/property/:propertyId', offerController.getPropertyOffers);

module.exports = router;