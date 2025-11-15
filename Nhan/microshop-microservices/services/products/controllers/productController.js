// service-products/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Lấy tất cả sản phẩm (có tìm kiếm, lọc, phân trang)
// @route   GET /api/v1/products
exports.getAllProducts = async (req, res) => {
    try {
        const resultsPerPage = 8; // Số sản phẩm trên mỗi trang
        const productsCount = await Product.countDocuments(); // Lấy tổng số sản phẩm trước

        const features = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .sort();
        
        // Cần lấy tổng số sản phẩm sau khi lọc (nếu có)
        const filteredProductsCount = await Product.countDocuments(features.query.getQuery());
        
        // Áp dụng phân trang sau khi đã có số lượng
        features.pagination(resultsPerPage);
            
        const products = await features.query;

        res.status(200).json({
            success: true,
            data: products,
            // **THÊM DỮ LIỆU PHÂN TRANG**
            pagination: {
                total: productsCount,
                filtered: filteredProductsCount,
                perPage: resultsPerPage,
                totalPages: Math.ceil(filteredProductsCount / resultsPerPage),
                currentPage: Number(req.query.page) || 1
            }
        });
    } catch (error) { 
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Tạo sản phẩm mới (chỉ Admin)
// @route   POST /api/v1/products
exports.createProduct = async (req, res) => {
    try {
        // req.user.id là ID của admin tạo sản phẩm
        req.body.user = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) { 
        res.status(404).json({ success: false, error: 'Không thể thêm sản phẩm' });
     }
};


// @desc    Lấy chi tiết sản phẩm
// @route   GET /api/v1/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
    // Lấy ID từ URL params
    const productId = req.params.id;

    console.log('Backend received ID:',productId);

    try {
        const product = await Product.findById(productId);

        if (product) {
            // Thay đổi ở đây: trả về response giống với updateProduct để nhất quán
            res.status(200).json({
                success: true,
                data: product
            });
        } else {
            // Nếu findById không tìm thấy gì (trả về null), gửi lỗi 404
            res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        // Bắt lỗi nếu ID không phải là định dạng hợp lệ của MongoDB
        console.error('Error fetching product by ID:', error);
        res.status(400).json({ success: false, error: 'ID không hợp lệ' });
    }
});


// @desc    Cập nhật sản phẩm (chỉ Admin)
// @route   PUT /api/v1/products/:id
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy sản phẩm'
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về document đã được cập nhật
            runValidators: true, // Chạy lại các trình xác thực (validators) trong schema
        });

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Lỗi Server'
        });
    }
};

// @desc    Xóa sản phẩm (chỉ Admin)
// @route   DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy sản phẩm'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Sản phẩm đã được xóa thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Lỗi Server'
        });
    }
};
