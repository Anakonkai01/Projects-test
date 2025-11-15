const express = require('express');
const { 
    createOrder, 
    getMyOrders,
    getAllOrders,    
    getOrderById,    
    updateOrderStatus,
    confirmClientPayment,
    getMyOrderById
} = require('../controllers/orderController');
const router = express.Router();

const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');

// === USER ROUTES ===
router.route('/me').get(protect, getMyOrders);
router.route('/').post(optionalProtect, createOrder);
router.route('/:id/confirm-payment').put(protect, confirmClientPayment);
router.route('/me/:id').get(protect, getMyOrderById);
// === ADMIN ROUTES ===
router.route('/').get(protect, authorize('ADMIN'), getAllOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorize('ADMIN'), updateOrderStatus);

module.exports = router;