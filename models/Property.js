const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'office'],
      default: null
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    amenities: [String],
    images: [String],
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);