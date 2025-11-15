// admin controller

const User = require('../models/userModel');

// @desc    Admin get all info users
// @route   GET /api/users/users
exports.getUsers = async (req, res) => {
    try {
        const resultsPerPage = 10; // Số lượng user trên mỗi trang
        const page = Number(req.query.page) || 1;
        
        const totalUsers = await User.countDocuments();
        
        const users = await User.find({})
            .limit(resultsPerPage)
            .skip(resultsPerPage * (page - 1));

        res.status(200).json({ 
            success: true, 
            data: users,
            pagination: {
                total: totalUsers,
                perPage: resultsPerPage,
                totalPages: Math.ceil(totalUsers / resultsPerPage),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Admin update info user (name and role)
// @route   PUT /api/users/users/:id
exports.updateUser = async (req, res) => {
    try {
        // Admin only update  'name' và 'role'
        const { name, role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, role }, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Admin delete user
// @route   DELETE /api/users/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getUserCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('cart');
        if (!user) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Cập nhật/Lưu giỏ hàng của user
// @route   PUT /api/users/auth/cart
exports.updateUserCart = async (req, res, next) => {
    try {
        const { cart } = req.body; // Nhận mảng cartItems từ frontend

        if (!Array.isArray(cart)) {
             return res.status(400).json({ success: false, error: 'Dữ liệu giỏ hàng không hợp lệ' });
        }

        await User.findByIdAndUpdate(req.user.id, { cart: cart });

        res.status(200).json({
            success: true,
            message: 'Giỏ hàng đã được lưu'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};