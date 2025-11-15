const jwt = require('jsonwebtoken');

// Middleware này không cần 'async' nữa vì không có thao tác DB
exports.protect = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route (no token)' });
    }

    try {
        // Chỉ cần xác thực token bằng secret key.
        // Secret key này phải giống hệt với secret key trong users-service.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Gắn thông tin user (payload) đã được giải mã vào request.
        // Payload này chứa id và role của user.
        req.user = decoded; 

        next();
    } catch (err) {
        // Nếu token không hợp lệ (sai, hết hạn), trả về lỗi 401.
        return res.status(401).json({ success: false, error: 'Not authorized to access this route (token failed)' });
    }
};
exports.optionalProtect = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }

    // Nếu không có token, vẫn tiếp tục mà không có req.user
    if (!token) {
        return next();
    }

    try {
        // Nếu có token, xác thực và gắn payload vào req.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Nếu token không hợp lệ, vẫn cho qua như một guest
        console.log('Invalid token on optional route, proceeding as guest.');
        next();
    }
};
// Middleware authorize không cần thay đổi, nó sẽ hoạt động với req.user mới
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // req.user bây giờ là { id: '...', role: '...', iat: ..., exp: ... }
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `User role '${req.user?.role}' is not authorized to access this route`
            });
        }
        next();
    };
};