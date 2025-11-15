// Nhan/microshop-microservices/services/users/utils/sendTokenResponse.js

const sendTokenResponse = (user, statusCode, res) => {
    // Tạo token
    const token = user.getJWTToken();

    // Tùy chọn cho cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    
    // --- BẮT ĐẦU SỬA ---

    // Chuyển Mongoose document thành POJO (Plain Old JavaScript Object)
    // .toJSON() sẽ tự động loại bỏ các trường có "select: false" (như 'password')
    const userPayload = user.toJSON();
    
    // Gắn token trực tiếp vào object user mà chúng ta gửi về
    userPayload.token = token;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            // Gửi về 'userPayload' thay vì chỉ 'token'
            user: userPayload 
        });
    
    // --- KẾT THÚC SỬA ---
};

module.exports = sendTokenResponse;