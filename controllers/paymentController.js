const paymentService = require('../services/paymentService');

const initiatePayment = async (req, res) => {
  try {
    const payment = await paymentService.processPayment(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await paymentService.getTenantPayments(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Payment history fetched successfully',
      data: payments,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentDetails(req.params.id, req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      message: 'Payment details fetched successfully',
      data: payment,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  initiatePayment,
  getMyPayments,
  getPayment,
};