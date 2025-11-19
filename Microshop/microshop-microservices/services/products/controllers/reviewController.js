const Product = require('../models/productModel');

// @desc    Tạo hoặc cập nhật một đánh giá
// @route   PUT /api/products/:productId/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const review = {
        user: req.user.id,
        name: req.user.name, // Giả sử middleware đã lấy được tên user
        rating: Number(rating),
        comment,
    };

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user.id.toString()
        );

        if (isReviewed) {
            // Nếu đã review, cập nhật lại
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user.id.toString()) {
                    rev.comment = comment;
                    rev.rating = rating;
                }
            });
        } else {
            // Nếu chưa, thêm review mới
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        // Tính toán lại điểm trung bình
        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: "Đánh giá thành công!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
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