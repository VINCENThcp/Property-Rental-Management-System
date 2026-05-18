const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../services/propertyService');

const addProperty = async (req, res, next) => {
  try {
    const property = await createProperty(req.body, req.user.id);
    res.status(201).json({
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

const getProperties = async (req, res, next) => {
  try {
    const properties = await getAllProperties();
    res.status(200).json({
      message: 'Properties fetched successfully',
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

const getProperty = async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);
    res.status(200).json({
      message: 'Property fetched successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

const editProperty = async (req, res, next) => {
  try {
    const property = await updateProperty(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

const removeProperty = async (req, res, next) => {
  try {
    const result = await deleteProperty(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProperty,
  getProperties,
  getProperty,
  editProperty,
  removeProperty,
};