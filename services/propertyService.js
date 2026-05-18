const Property = require('../models/Property');

const createProperty = async (data, landlordId) => {
  const property = await Property.create({
    ...data,
    landlord: landlordId,
  });
  return property;
};

const getAllProperties = async () => {
  const properties = await Property.find({ isAvailable: true, status: 'active' })
    .populate('landlord', 'name email phone');
  return properties;
};

const getPropertyById = async (id) => {
  const property = await Property.findById(id)
    .populate('landlord', 'name email phone');
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }
  return property;
};

const updateProperty = async (id, data, userId, userRole) => {
  const property = await Property.findById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  // Only the landlord who owns it or admin can update
  if (property.landlord.toString() !== userId && userRole !== 'admin') {
    const error = new Error('You are not authorized to update this property');
    error.statusCode = 403;
    throw error;
  }

  const updated = await Property.findByIdAndUpdate(id, data, { new: true });
  return updated;
};

const deleteProperty = async (id, userId, userRole) => {
  const property = await Property.findById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  // Only the landlord who owns it or admin can delete
  if (property.landlord.toString() !== userId && userRole !== 'admin') {
    const error = new Error('You are not authorized to delete this property');
    error.statusCode = 403;
    throw error;
  }

  await Property.findByIdAndDelete(id);
  return { message: 'Property deleted successfully' };
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};

