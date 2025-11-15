// File: microshop-microservices/services/users/controllers/addressController.js (ĐÃ SỬA LỖI)

const User = require('../models/userModel');

// @desc    Lấy tất cả địa chỉ của user
// @route   GET /api/users/addresses
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        res.status(200).json({ success: true, data: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Thêm địa chỉ mới
// @route   POST /api/users/addresses
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newAddress = req.body;

        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json({ success: true, data: user }); // Trả về user object mới
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Cập nhật một địa chỉ
// @route   PUT /api/users/addresses/:addressId
exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }
        
        if (req.body.isDefault) {
             user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Xóa một địa chỉ
// @route   DELETE /api/users/addresses/:addressId
exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        // **DÙNG PHƯƠNG THỨC PULL ĐỂ XÓA SUB-DOCUMENT**
        user.addresses.pull({ _id: req.params.addressId });

        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};