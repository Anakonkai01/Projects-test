// service-users/controllers/authController.js

const User = require('../models/userModel');
const sendTokenResponse = require('../utils/sendTokenResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Đăng ký người dùng mới
// @route   POST /api/v1/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Vui lòng cung cấp đủ thông tin' });
        }
        
        // Validate name length
        if (name.trim().length < 2) {
            return res.status(400).json({ success: false, error: 'Tên phải có ít nhất 2 ký tự' });
        }
        
        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ success: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' });
        }
        
        // Kiểm tra email tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, error: 'Email đã được sử dụng. Vui lòng sử dụng email khác.' });
        }

        // Tạo user mới (mật khẩu sẽ được tự động hash bởi pre-save hook trong model)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role
        });
        
        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Register error:', error);
        
        // Xử lý lỗi validation của Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        
        res.status(500).json({ success: false, error: 'Lỗi server khi đăng ký. Vui lòng thử lại.' });
    }
};

// @desc    Đăng nhập
// @route   POST /api/v1/auth/login
// Thay thế hàm login cũ bằng hàm đã được cập nhật này
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Vui lòng nhập email và mật khẩu' });
        }
        
        // Tìm user và lấy cả password field
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
        }
        
        // THÊM ĐOẠN KIỂM TRA NÀY
        // Nếu user tồn tại nhưng không có mật khẩu, nghĩa là họ đăng ký qua social login
        if (!user.password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Tài khoản này được đăng nhập bằng Google. Vui lòng sử dụng "Quên mật khẩu" để tạo mật khẩu mới hoặc đăng nhập bằng Google.' 
            });
        }
        
        // So sánh mật khẩu
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không đúng' });
        }
        
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Lỗi server khi đăng nhập. Vui lòng thử lại.' });
    }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
    // req.user được gán từ middleware protect
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

// @desc    Cập nhật thông tin người dùng (tên, email)
// @route   PUT /api/users/auth/updatedetails
exports.updateDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Kiểm tra nếu là tài khoản Google và cố gắng đổi email
        if (user.googleId && req.body.email && req.body.email !== user.email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Tài khoản Google không thể thay đổi email. Email được quản lý bởi Google.' 
            });
        }
        
        const fieldsToUpdate = {
            name: req.body.name
        };
        
        // Chỉ cho phép đổi email nếu không phải tài khoản Google
        if (!user.googleId && req.body.email) {
            fieldsToUpdate.email = req.body.email;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Update details error:', error);
        
        // Xử lý lỗi validation của Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        
        // Xử lý lỗi email trùng (duplicate key)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email này đã được sử dụng' });
        }
        
        res.status(500).json({ success: false, error: 'Lỗi server khi cập nhật thông tin' });
    }
};

// @desc    Cập nhật mật khẩu
// @route   PUT /api/users/auth/updatepassword
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới' 
            });
        }

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mật khẩu mới phải có ít nhất 8 ký tự' 
            });
        }

        // Lấy user từ DB, bao gồm cả trường password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra nếu user đăng nhập bằng Google (không có password)
        if (user.googleId && !user.password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Tài khoản này đăng nhập qua Google, không thể đổi mật khẩu. Vui lòng sử dụng "Quên mật khẩu" để tạo mật khẩu mới.' 
            });
        }

        // Kiểm tra mật khẩu hiện tại có khớp không
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Mật khẩu hiện tại không đúng' });
        }

        // Cập nhật mật khẩu mới
        user.password = newPassword;
        await user.save(); // pre-save hook sẽ tự động hash mật khẩu mới

        // Gửi về token mới
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Update password error:', error);
        
        // Xử lý lỗi validation của Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        
        res.status(500).json({ success: false, error: 'Lỗi server khi đổi mật khẩu' });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // Luôn trả về thông báo thành công để tránh kẻ xấu dò email
        if (!user) {
            return res.status(200).json({ success: true, data: 'Email sent' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        const message = `
            <h1>Yêu cầu đặt lại mật khẩu</h1>
            <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu (liên kết có hiệu lực trong 10 phút):</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu - Microshop',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        // Nếu có lỗi, xóa token để user có thể thử lại
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ success: false, error: 'Không thể gửi email' });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        sendTokenResponse(user, 200, res); // Tự động đăng nhập cho user
    } catch (error) {
        // Cải thiện xử lý lỗi: Bắt lỗi validation (ví dụ: mật khẩu quá ngắn)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            // Trả về lỗi 400 thay vì 500
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        console.error("Lỗi khi reset mật khẩu:", error); // Log lỗi chi tiết ở server
        res.status(500).json({ success: false, error: "Đã có lỗi xảy ra phía máy chủ." });
    }
};
