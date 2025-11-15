// E_com/BE/services/orders/controllers/statsController.js
const Order = require('../models/orderModel');
const moment = require('moment');
// @desc    Lấy thống kê đơn hàng
// @route   GET /stats/summary
exports.getSummary = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const revenueStats = await Order.aggregate([
            {
                $match: { 'paymentInfo.status': 'succeeded' } // Chỉ tính các đơn đã thanh toán thành công
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getSalesStats = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'month' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, error: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc.' });
        }

        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        let groupFormat;
        switch (groupBy) {
            case 'year': groupFormat = '%Y'; break;
            case 'month': groupFormat = '%Y-%m'; break;
            case 'week': groupFormat = '%Y-%U'; break; // %U: Tuần trong năm (Chủ nhật là ngày đầu tuần)
            case 'day': default: groupFormat = '%Y-%m-%d'; break;
        }

        const salesData = await Order.aggregate([
            {
                // 1. Lọc các đơn hàng đã thanh toán thành công trong khoảng thời gian
                $match: {
                    paidAt: { $gte: start, $lte: end },
                    'paymentInfo.status': 'succeeded'
                }
            },
            {
                // 2. Nhóm các đơn hàng lại theo định dạng thời gian (năm, tháng, tuần, ngày)
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: "$paidAt" } },
                    totalRevenue: { $sum: '$totalPrice' }, // Tổng doanh thu
                    totalItemsPrice: { $sum: '$itemsPrice' }, // Tổng tiền hàng (trước thuế, ship)
                    totalOrders: { $sum: 1 } // Đếm số lượng đơn hàng
                }
            },
            {
                // 3. Tính toán lợi nhuận và định dạng lại output
                $project: {
                    _id: 1, // Giữ lại _id (là khoảng thời gian)
                    totalRevenue: 1,
                    totalOrders: 1,
                    // Lợi nhuận = 6% của tổng tiền hàng
                    totalProfit: { $multiply: ["$totalItemsPrice", 0.06] } 
                }
            },
            {
                // 4. Sắp xếp kết quả theo thời gian tăng dần
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({ success: true, data: salesData });

    } catch (error) {
        console.error("Error getting sales stats:", error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};