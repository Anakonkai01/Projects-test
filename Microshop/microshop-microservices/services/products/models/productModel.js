// Nhan/microshop-microservices/services/products/models/productModel.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, 'Vui lòng nhập bình luận của bạn'] },
    createdAt: { type: Date, default: Date.now },
});

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true }, 
    stock: { type: Number, required: true, default: 0 }, 
    price: { type: Number, required: true }, 
    sold: { type: Number, default: 0 },
    imageIndex: { type: Number, default: 0 } 
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên sản phẩm'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    },
    variants: {
        type: [variantSchema],
    },
    price: {
        type: Number,
        required: [true, 'Vui lòng nhập giá gốc cho sản phẩm'],
    },
    images: {
        type: [{
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        }],
    },
    brand: {
        type: String,
        required: [true, 'Vui lòng nhập thương hiệu sản phẩm'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    sold: {
        type: Number,
        default: 0
    },
    specifications: {
        display: String,
        processor: String, 
        ram: String,
        storage: String,
        graphics: String, 
        battery: String,
    },
    user: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);