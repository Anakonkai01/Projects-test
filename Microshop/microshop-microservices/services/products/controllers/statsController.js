// E_com/BE/services/products/controllers/statsController.js
const Product = require('../models/productModel');

// @desc    Lấy thống kê sản phẩm
// @route   GET /stats/summary
exports.getSummary = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        // Lấy 5 sản phẩm bán chạy nhất
        const bestSellers = await Product.find()
            .sort({ sold: -1 })
            .limit(5)
            .select('name sold');

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                bestSellers,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};