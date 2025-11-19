// E_com/BE/services/orders/routes/paymentRoutes.js
const express = require('express');
const { createPaymentUrl, vnpayIpn } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User gọi để tạo URL thanh toán
router.post('/create_payment_url', protect, createPaymentUrl);

// VNPay gọi đến để cập nhật trạng thái
router.get('/vnpay_ipn', vnpayIpn);

module.exports = router;