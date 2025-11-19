const Discount = require('../models/discountModel');
const Order = require('../models/orderModel');

// @desc    Admin tạo mã giảm giá mới
// @route   POST /api/discounts
// @access  Private/Admin
exports.createDiscount = async (req, res) => {
    try {
        const discount = await Discount.create(req.body);
        res.status(201).json({ success: true, data: discount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Admin lấy tất cả mã giảm giá
// @route   GET /api/discounts
// @access  Private/Admin
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find({}).populate('ordersApplied', 'id totalPrice');
        res.status(200).json({ success: true, data: discounts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Admin cập nhật mã giảm giá
// @route   PUT /api/discounts/:id
// @access  Private/Admin
exports.updateDiscount = async (req, res) => {
    try {
        const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!discount) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy mã giảm giá' });
        }
        res.status(200).json({ success: true, data: discount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Admin xóa mã giảm giá
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
exports.deleteDiscount = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        if (!discount) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy mã giảm giá' });
        }
        await discount.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// @desc    User xác thực mã giảm giá
// @route   POST /api/discounts/validate
// @access  Private
exports.validateDiscount = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'Vui lòng cung cấp mã giảm giá' });
        }

        const discount = await Discount.findOne({ code });

        if (!discount) {
            return res.status(404).json({ success: false, error: 'Mã giảm giá không hợp lệ' });
        }

        if (discount.timesUsed >= discount.usageLimit) {
            return res.status(400).json({ success: false, error: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        res.status(200).json({ success: true, data: discount });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};