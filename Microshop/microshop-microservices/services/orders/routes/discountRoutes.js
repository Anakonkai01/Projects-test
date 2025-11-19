const express = require('express');
const {
    createDiscount,
    getAllDiscounts,
    updateDiscount,
    deleteDiscount,
    validateDiscount
} = require('../controllers/discountController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// === USER ROUTE ===
// Người dùng chỉ cần xác thực mã
router.post('/validate', protect, validateDiscount);

// === ADMIN ROUTES ===
// Admin có toàn quyền CRUD
router.use(protect, authorize('ADMIN'));

router.route('/')
    .post(createDiscount)
    .get(getAllDiscounts);

router.route('/:id')
    .put(updateDiscount)
    .delete(deleteDiscount);

module.exports = router;