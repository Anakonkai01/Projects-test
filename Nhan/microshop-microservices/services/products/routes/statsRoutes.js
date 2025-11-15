// E_com/BE/services/products/routes/statsRoutes.js
const express = require('express');
const { getSummary } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, authorize('ADMIN'), getSummary);

module.exports = router;