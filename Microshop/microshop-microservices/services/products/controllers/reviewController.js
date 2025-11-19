const Product = require('../models/productModel');

// @desc    Tạo hoặc cập nhật một đánh giá
// @route   PUT /api/products/:productId/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Validate input
    if (!rating || !comment) {
        return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ đánh giá và bình luận' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Đánh giá phải từ 1 đến 5 sao' });
    }

    if (comment.trim().length < 10) {
        return res.status(400).json({ success: false, error: 'Bình luận phải có ít nhất 10 ký tự' });
    }

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment.trim(),
    };

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        // Luôn thêm review mới, không kiểm tra đã review hay chưa
        // Người dùng có thể đánh giá nhiều lần
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

        // Tính toán lại điểm trung bình
        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({ 
            success: true, 
            message: "Đánh giá thành công!",
            data: {
                ratings: product.ratings,
                numOfReviews: product.numOfReviews
            }
        });

    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ success: false, error: 'Lỗi server khi tạo đánh giá' });
    }
};

// @desc    Lấy tất cả đánh giá của một sản phẩm
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Admin xóa một đánh giá
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.params.reviewId.toString()
        );

        const numOfReviews = reviews.length;

        const ratings = numOfReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews : 0;

        await Product.findByIdAndUpdate(req.params.productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};