// Nhan/microshop-microservices/services/products/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('../config/cloudinary');

// @desc    Lấy tất cả sản phẩm (HÀM ĐƯỢC GIỮ LẠI)
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

// @desc    Lấy chi tiết sản phẩm (HÀM ĐƯỢC GIỮ LẠI)
// @route   GET /api/v1/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    console.log('Backend received ID:',productId);

    try {
        const product = await Product.findById(productId);

        if (product) {
            res.status(200).json({
                success: true,
                data: product
            });
        } else {
            res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(400).json({ success: false, error: 'ID không hợp lệ' });
    }
});


// @desc    Tạo sản phẩm mới (HÀM ĐÃ SỬA)
// @route   POST /api/v1/products
exports.createProduct = async (req, res) => {
    try {
        // 1. Xử lý các trường JSON được gửi dưới dạng string
        const variants = JSON.parse(req.body.variants);
        const specifications = JSON.parse(req.body.specifications);

        // 2. Xử lý file ảnh đã được upload lên Cloudinary bởi middleware
        if (!req.files || req.files.length < 3) {
            return res.status(400).json({ success: false, error: 'Sản phẩm phải có ít nhất 3 hình ảnh.' });
        }
        
        const images = req.files.map(file => ({
            public_id: file.filename, // Multer-storage-cloudinary trả về public_id trong 'filename'
            url: file.path          // và url trong 'path'
        }));

        // 3. Tạo product
        const productData = {
            ...req.body,
            variants,
            specifications,
            images,
            user: req.user.id
        };

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });

    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        // Nếu có lỗi, xóa các ảnh đã lỡ upload lên Cloudinary
        if (req.files) {
            req.files.forEach(file => cloudinary.uploader.destroy(file.filename));
        }
        res.status(400).json({ success: false, error: 'Không thể thêm sản phẩm. ' + error.message });
     }
};


// @desc    Cập nhật sản phẩm (HÀM ĐÃ SỬA)
// @route   PUT /api/v1/products/:id
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        // 1. Lấy danh sách ảnh CŨ từ DB
        const oldImageIds = product.images.map(img => img.public_id);

        // 2. Lấy danh sách ảnh MỚI (bao gồm ảnh cũ còn giữ lại + ảnh mới upload)
        let newImages = [];
        
        // 2a. Ảnh cũ còn giữ lại (được gửi lên dưới dạng JSON string)
        if (req.body.existingImages) {
            newImages = [...JSON.parse(req.body.existingImages)];
        }
        
        // 2b. Ảnh mới vừa upload (từ req.files)
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => ({
                public_id: file.filename,
                url: file.path
            }));
            newImages = [...newImages, ...uploadedImages];
        }

        if (newImages.length < 3) {
             return res.status(400).json({ success: false, error: 'Sản phẩm phải có ít nhất 3 hình ảnh.' });
        }

        // 3. Tìm và Xóa ảnh cũ không còn dùng
        const newImageIds = newImages.map(img => img.public_id);
        const imagesToDelete = oldImageIds.filter(id => !newImageIds.includes(id));
        
        if (imagesToDelete.length > 0) {
            console.log('Đang xóa ảnh cũ:', imagesToDelete);
            await Promise.all(imagesToDelete.map(id => cloudinary.uploader.destroy(id)));
        }

        // 4. Chuẩn bị dữ liệu update
        const updateData = {
            ...req.body,
            variants: JSON.parse(req.body.variants),
            specifications: JSON.parse(req.body.specifications),
            images: newImages
        };
        
        // 5. Cập nhật product
        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: product });

    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        // Nếu có lỗi, xóa các ảnh MỚI đã lỡ upload
        if (req.files) {
            req.files.forEach(file => cloudinary.uploader.destroy(file.filename));
        }
        res.status(500).json({ success: false, error: 'Lỗi Server: ' + error.message });
    }
};

// @desc    Xóa sản phẩm (HÀM ĐÃ SỬA)
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

        // Xóa ảnh trên Cloudinary
        if (product.images && product.images.length > 0) {
            await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id)));
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

// @desc    Lấy danh sách các thương hiệu (brands) duy nhất
// @route   GET /products_ser/brands/all
exports.getAllBrands = async (req, res) => {
    try {
        console.log('📦 getAllBrands: Fetching brands from database...');
        
        // Lấy tất cả các brand duy nhất, loại bỏ null và empty string, sắp xếp A-Z
        const brands = await Product.distinct('brand');
        console.log('📦 getAllBrands: Found', brands.length, 'unique brands');
        
        const filteredBrands = brands.filter(brand => brand && brand.trim() !== '').sort();
        console.log('📦 getAllBrands: Returning', filteredBrands.length, 'filtered brands:', filteredBrands);
        
        res.status(200).json({
            success: true,
            data: filteredBrands,
            count: filteredBrands.length
        });
    } catch (error) {
        console.error('❌ Error in getAllBrands:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error',
            message: error.message 
        });
    }
};