const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const processPayment = async (paymentData, tenantId) => {
  const { bookingId, paymentMethod } = paymentData;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.tenant.toString() !== tenantId) {
    throw new Error('Not authorized to pay for this booking');
  }

  if (booking.status === 'approved' || booking.status === 'completed') {
    throw new Error('This booking has already been paid for and approved');
  }

  const isPaymentSuccessful = true; // Simulated success
  const transactionReference = `TXN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  const payment = await Payment.create({
    booking: bookingId,
    tenant: tenantId,
    amount: booking.totalAmount, 
    paymentMethod,
    transactionReference,
    paymentStatus: isPaymentSuccessful ? 'successful' : 'failed',
  });

  if (isPaymentSuccessful) {
    booking.status = 'approved';
    await booking.save();
  }

  return payment;
};

const getTenantPayments = async (tenantId) => {
  return await Payment.find({ tenant: tenantId })
    .populate({
      path: 'booking',
      select: 'startDate endDate status property'
    })
    .sort('-createdAt');
};

const getPaymentDetails = async (paymentId, userId, userRole) => {
  const payment = await Payment.findById(paymentId).populate('booking');
  
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.tenant.toString() !== userId && userRole !== 'admin') {
    throw new Error('Not authorized to view this payment receipt');
  }

  return payment;
};

module.exports = {
  processPayment,
  getTenantPayments,
  getPaymentDetails,
};