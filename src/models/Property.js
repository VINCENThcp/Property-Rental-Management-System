const mongoose = require('mongoose');

// This schema defines the structure for all property listings 
const propertySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'A property must have a title'] 
  },
  description: { 
    type: String, 
    required: [true, 'A property must have a description'] 
  },
  address: { 
    type: String, 
    required: [true, 'A property must have an address'] 
  },
  price: { 
    type: Number, 
    required: [true, 'A property must have a price'] 
  },
  // This links the property to a specific Landlord/User 
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true // Automatically tracks when the property was created/updated
});

module.exports = mongoose.model('Property', propertySchema);