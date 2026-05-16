const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
      subject: {
        type: String, 
        required: true
      },
      message: {
        type: String, required: true
      },
      status: {
        type: String,
        enum: ['open', 'in_review', 'resolved'],
        default: 'open',
      },
      adminNote: {
        type: String,
      }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);