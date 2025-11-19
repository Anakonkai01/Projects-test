// File: microshop-microservices/services/users/models/userModel.js (Phiên bản đầy đủ)

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto để tạo token

// Schema cho địa chỉ giao hàng
const addressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNo: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true }, // Product ID
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true },
    variant: {
        _id: { type: mongoose.Schema.ObjectId, required: true },
        name: { type: String, required: true },
        sku: { type: String },
        stock: { type: Number },
        price: { type: Number }
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên của bạn'],
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email của bạn'],
        unique: true,
        validate: [validator.isEmail, 'Vui lòng nhập một email hợp lệ'],
    },
    password: {
        type: String,
        minLength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
        select: false,
    },
    googleId: {
        type: String,
    },
    avatar: {
        public_id: { type: String },
        url: { type: String },
    },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    addresses: [addressSchema],
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    cart: {
        type: [cartItemSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Middleware mã hóa mật khẩu 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Method: Tạo JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id, role: this.role, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Method: So sánh mật khẩu
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// **PHẦN ĐƯỢC THÊM VÀO**
// Method: Tạo và hash password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Tạo token thô
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token và gán vào trường resetPasswordToken để lưu vào DB
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Cài đặt thời gian hết hạn cho token (10 phút)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    // Trả về token thô (chưa hash) để gửi qua email cho người dùng
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);