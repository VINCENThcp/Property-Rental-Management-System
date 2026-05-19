const offerService = require('../services/offerService');

// 1. Pass tenant ID from req.body or logged-in user (req.user)
const makeOffer = async (req, res, next) => {
    try {
        // Accepts tenant from req.body.tenant or req.user.id if auth middleware is used
        const tenantId = req.user.id; 
        if (!tenantId) {
            return res.status(400).json({ status: 'fail', message: 'Tenant ID is required' });
        }
        const offer = await offerService.createOffer(req.body, tenantId);
        res.status(201).json({ status: 'success', data: offer });
    } catch (error) {
        next(error);
    }
};

const getPropertyOffers = async (req, res, next) => {
    try {
        const offers = await offerService.getOffersForProperty(req.params.propertyId);
        res.status(200).json({ status: 'success', results: offers.length, data: offers });
    } catch (error) {
        next(error);
    }
};

// 2. Tenant viewing their own offers
const getMyOffers = async (req, res, next) => {
    try {
        const tenantId = req.user ? req.user.id : req.params.tenantId; // fallback if middleware differs
        const offers = await offerService.getTenantOffers(tenantId);
        res.status(200).json({ status: 'success', results: offers.length, data: offers });
    } catch (error) {
        next(error);
    }
};

// 3. Admin viewing all offers
const getAdminOffers = async (req, res, next) => {
    try {
        const offers = await offerService.getAllOffers();
        res.status(200).json({ status: 'success', results: offers.length, data: offers });
    } catch (error) {
        next(error);
    }
};

// 4. Landlord accepting or rejecting
const respondToOffer = async (req, res, next) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const offer = await offerService.updateOfferStatus(req.params.offerId, status);
        res.status(200).json({ status: 'success', data: offer });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    makeOffer, 
    getPropertyOffers, 
    getMyOffers, 
    getAdminOffers, 
    respondToOffer 
};