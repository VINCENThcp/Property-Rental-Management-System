const Property = require('../models/Property');

// Business logic to add a new property to the database
const createProperty = async (propertyData) => {
    // Business Rule: Ensure price is at least 0
    if (propertyData.price < 0) {
        throw new Error("Property price cannot be negative");
    }
    const newProperty = await Property.create(propertyData);
    return newProperty;
};

// Business logic to find all properties currently marked as available
const getAvailableProperties = async () => {
    return await Property.find({ isAvailable: true });
};

module.exports = {
    createProperty,
    getAvailableProperties
};