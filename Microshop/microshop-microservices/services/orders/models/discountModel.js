const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    // YÊU CẦU: Mã là chuỗi 5 ký tự chữ và số [cite: 60]
    code: {
        type: String,
        required: [true, 'Mã giảm giá là bắt buộc'],
        unique: true,
        match: [/^[A-Z0-9]{5}$/, 'Mã phải là 5 ký tự chữ hoa hoặc số'],
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // Giảm theo % hoặc số tiền cố định
        required: true,
    },
    value: {
        type: Number,
        required: [true, 'Giá trị giảm là bắt buộc'],
    },
    // YÊU CẦU: Có giới hạn sử dụng, tối đa 10 lần [cite: 61]
    usageLimit: {
        type: Number,
        required: true,
        max: [10, 'Giới hạn sử dụng tối đa là 10'],
    },
    timesUsed: {
        type: Number,
        default: 0,
    },
    // YÊU CẦU: Admin có thể xem danh sách các đơn hàng đã áp dụng mã [cite: 94]
    ordersApplied: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Discount', discountSchema);