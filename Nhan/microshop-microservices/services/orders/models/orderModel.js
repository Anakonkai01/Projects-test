const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phoneNo: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    orderItems: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        variant: { type: mongoose.Schema.ObjectId, required: true }, // ID của biến thể được mua
        product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Tham chiếu đến model User (dù ở service khác)
        required: true,
    },
    paymentInfo: {
        id: { type: String }, 
        status: { type: String, required: true }, // Trạng thái giao dịch (succeeded, pending, failed)
    },
    paidAt: { type: Date },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    orderStatusHistory: [{
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);