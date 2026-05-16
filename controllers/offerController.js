const offerService = require('../services/offerService');

const makeOffer = async (req, res, next) => {
    try {
        const offer = await offerService.createOffer(req.body);
        res.status(201).json({ status: 'success', data: offer });
    } catch (error) {
        next(error);
    }
};

const getPropertyOffers = async (req, res, next) => {
    try {
        const offers = await offerService.getOffersForProperty(req.params.propertyId);
        res.status(200).json({
            status: 'success',
            results: offers.length,
            data: offers
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { makeOffer, getPropertyOffers };