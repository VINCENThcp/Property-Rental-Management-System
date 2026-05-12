const Offer = require('../models/Offer');

const createOffer = async (offerData) => {
    if (offerData.amount <= 0) {
        throw new Error("Offer amount must be a positive number");
    }
    return await Offer.create(offerData);
};

const getOffersForProperty = async (propertyId) => {
    return await Offer.find({ property: propertyId }).populate('tenant', 'name email');
};

module.exports = { createOffer, getOffersForProperty };