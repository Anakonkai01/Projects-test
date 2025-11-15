// E_com/BE/services/orders/routes/statsRoutes.js
const express = require('express');
const { getSummary, getSalesStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, authorize('ADMIN'), getSummary);
router.get('/sales', protect, authorize('ADMIN'), getSalesStats);

module.exports = router;