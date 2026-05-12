const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  role: {
    type: String,
    enum: ['landlord', 'tenant', 'admin'],
    default: 'tenant'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);