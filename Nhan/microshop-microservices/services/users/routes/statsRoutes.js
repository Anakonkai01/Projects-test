// E_com/BE/services/users/routes/statsRoutes.js
const express = require('express');
const { getSummary } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Chỉ Admin mới được truy cập
router.get('/summary', protect, authorize('ADMIN'), getSummary);

module.exports = router;