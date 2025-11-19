// E_com/BE/services/users/controllers/statsController.js
const User = require('../models/userModel');

// @desc    Lấy thống kê người dùng
// @route   GET /stats/summary
exports.getSummary = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Định nghĩa "người dùng mới" là những người đăng ký trong 7 ngày qua
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                newUsers,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};