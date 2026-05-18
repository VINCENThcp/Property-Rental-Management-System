const Offer = require('../models/Offer');

// 1. Create offer accepting tenant ID
const createOffer = async (offerData, tenantId) => {
    if (offerData.amount <= 0) {
        throw new Error("Offer amount must be a positive number");
    }
    return await Offer.create({ ...offerData, tenant: tenantId });
};

const getOffersForProperty = async (propertyId) => {
    return await Offer.find({ property: propertyId }).populate('tenant', 'name email');
};

// 2. Tenants able to view their offers
const getTenantOffers = async (tenantId) => {
    return await Offer.find({ tenant: tenantId }).populate('property', 'title price');
};

// 3. Admin viewing all offers
const getAllOffers = async () => {
    return await Offer.find().populate('property', 'title').populate('tenant', 'name email');
};

// 4. Landlord accepting/rejecting offers
const updateOfferStatus = async (offerId, status) => {
    if (!['accepted', 'rejected'].includes(status)) {
        throw new Error("Status must be either 'accepted' or 'rejected'");
    }
    return await Offer.findByIdAndUpdate(offerId, { status }, { new: true });
};

module.exports = { 
    createOffer, 
    getOffersForProperty, 
    getTenantOffers, 
    getAllOffers, 
    updateOfferStatus 
};