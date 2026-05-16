const express = require('express');
const {
  initiatePayment,
  getMyPayments,
  getPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

const router = express.Router();

router.use(protect);

router.post('/process', authorize('tenant'), initiatePayment);
router.get('/my-payments', authorize('tenant'), getMyPayments);
router.get('/:id', getPayment);

module.exports = router;