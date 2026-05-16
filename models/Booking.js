const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.ObjectId, ref: 'Property' },
  totalAmount: { type: Number },
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);