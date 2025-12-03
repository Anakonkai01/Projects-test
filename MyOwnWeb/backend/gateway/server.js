const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware chung
app.use(cors()); // Cho phép Frontend gọi API
app.use(morgan('dev')); // Log request ra console để debug

// === CẤU HÌNH PROXY (Quan trọng) ===
// Quy tắc: 
// Client gọi: /api/users/login 
// -> Gateway chuyển tới: http://users:8001/api/users/login (Giữ nguyên path)
// Lý do: Để Users Service tự định nghĩa route của nó, Gateway chỉ chuyển tiếp.

// 1. Users Service Proxy
app.use('/api/users', createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL || 'http://localhost:8001',
    changeOrigin: true,
    // Không dùng pathRewrite để tránh rối, bên service sẽ mount route vào /api/users
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Gateway] Proxied to Users: ${req.method} ${req.url}`);
    }
}));

// (Sau này sẽ thêm Products và Orders ở đây)

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Microshop API Gateway is running 🚀' });
});

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});