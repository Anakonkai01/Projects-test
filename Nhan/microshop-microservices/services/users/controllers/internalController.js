// E_com/BE/services/users/controllers/internalController.js
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
exports.updateUserPoints = async (req, res) => {
    try {
        const { userId, points } = req.body; // 'points' có thể dương (cộng) hoặc âm (trừ)

        if (!userId || points === undefined) {
            return res.status(400).json({ success: false, error: 'Thiếu userId hoặc points' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
        }

        if (user.loyaltyPoints + points < 0) {
            return res.status(400).json({ success: false, error: 'Không đủ điểm để thực hiện giao dịch' });
        }

        await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: points } });
        res.status(200).json({ success: true, message: 'Cập nhật điểm thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật điểm nội bộ:', error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};

exports.findOrCreateUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email là bắt buộc' });
        }

        let user = await User.findOne({ email });

        // Nếu user chưa tồn tại, tạo mới
        if (!user) {
            user = await User.create({
                name: name || `User ${Date.now()}`,
                email,
                role: 'USER'
                // Không có password
            });

            // Gửi email yêu cầu đặt mật khẩu
            const resetToken = user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            const setPasswordUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
            const message = `
                <h1>Chào mừng bạn đến với Microshop!</h1>
                <p>Một tài khoản đã được tạo cho bạn với email này sau khi bạn hoàn tất một đơn hàng.</p>
                <p>Vui lòng nhấp vào nút bên dưới để đặt mật khẩu và truy cập lịch sử đơn hàng của bạn.</p>
                <a href="${setPasswordUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Đặt mật khẩu</a>
            `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Chào mừng bạn! Hãy hoàn tất tài khoản Microshop',
                    message
                });
            } catch (emailError) {
                console.error('Không thể gửi email kích hoạt cho user mới:', emailError);
                // Vẫn tiếp tục xử lý đơn hàng dù không gửi được email
            }
            
            return res.status(201).json({ success: true, userId: user._id });
        }

        // Nếu user đã tồn tại, chỉ trả về ID
        res.status(200).json({ success: true, userId: user._id });

    } catch (error) {
        console.error('Lỗi trong findOrCreateUser:', error);
        res.status(500).json({ success: false, error: 'Lỗi Server' });
    }
};