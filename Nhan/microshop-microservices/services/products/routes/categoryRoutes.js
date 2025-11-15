const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllCategories) // Mọi người đều có thể xem
    .post(protect, authorize('ADMIN'), createCategory); // Chỉ admin được tạo

module.exports = router;