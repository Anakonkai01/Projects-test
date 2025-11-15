const mongoose = require('mongoose');

// Schema cho một đánh giá (review)
const reviewSchema = new mongoose.Schema({
    user: { // User đã viết review
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { // Tên của user (lưu lại để không cần populate)
        type: String,
        required: true,
    },
    rating: { // Điểm đánh giá (1-5 sao)
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: { // Nội dung bình luận
        type: String,
        required: [true, 'Vui lòng nhập bình luận của bạn'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Schema cho biến thể sản phẩm (màu sắc, dung lượng, v.v.)
const variantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Ví dụ: 'Xanh Titan, 256GB'
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 }, // Tồn kho riêng cho mỗi biến thể
    price: { type: Number, required: true }, // Giá riêng cho mỗi biến thể
    sold: { type: Number, default: 0 }
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
        validate: [val => val.length >= 2, 'Sản phẩm phải có ít nhất 2 biến thể'] //
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
        validate: [val => val.length >= 3, 'Sản phẩm phải có ít nhất 3 hình ảnh'] //
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Vui lòng chọn danh mục sản phẩm'],
    },
    brand: {
        type: String,
        required: [true, 'Vui lòng nhập thương hiệu sản phẩm'],
    },
    // --- PHẦN REVIEW ĐÃ ĐƯỢC CẬP NHẬT ---
    ratings: { // Điểm đánh giá trung bình
        type: Number,
        default: 0
    },
    numOfReviews: { // Tổng số lượng đánh giá
        type: Number,
        default: 0
    },
    reviews: [reviewSchema], // Mảng chứa các đánh giá
    sold: {
        type: Number,
        default: 0
    },
    specifications: {
        display: String,
        processor: String, // CPU
        ram: String,
        storage: String,
        graphics: String, // Card đồ họa
        battery: String,
    },
    user: { // Admin tạo sản phẩm
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
    
},
);

module.exports = mongoose.model('Product', productSchema);