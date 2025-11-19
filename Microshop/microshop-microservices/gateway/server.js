const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Đảm bảo dotenv được gọi đầu tiên
dotenv.config({ path: '../.env' }); // Giả sử file .env ở thư mục gốc project

const app = express();
const PORT = process.env.GATEWAY_PORT || 9000;

// Định nghĩa target từ biến môi trường
const USERS_TARGET = process.env.USERS_TARGET || 'http://localhost:8001';
const PRODUCTS_TARGET = process.env.PRODUCTS_TARGET || 'http://localhost:8002';
const ORDERS_TARGET = process.env.ORDERS_TARGET || 'http://localhost:8003';

// --- CÁC QUY TẮC PROXY (ĐẶT TRƯỚC MIDDLEWARE KHÁC) ---

// Quy tắc cho Products 
app.use('/api/products', createProxyMiddleware({ 
    target: `${PRODUCTS_TARGET}/products_ser`, 
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Products Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
    }
}));

// Các middleware chung
app.use(cors());
app.use(morgan('tiny'));

// Route kiểm tra sức khỏe của gateway
app.get('/health', (_, res) => res.json({ ok: true, service: 'gateway' }));

// --- CÁC QUY TẮC PROXY KHÁC ---

// Quy tắc cho Auth
app.use('/api/auth', createProxyMiddleware({ 
    target: USERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/auth': '/auth' } 
}));

// Quy tắc cho Users
app.use('/api/users', createProxyMiddleware({ 
    target: USERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/users': '/users' } 
}));

// Quy tắc cho Categories
app.use('/api/categories', createProxyMiddleware({
    target: PRODUCTS_TARGET,
    changeOrigin: true, 
    pathRewrite: {
        '^/api/categories': '/categories',
    },
}));

// Quy tắc cho Orders
app.use('/api/orders', createProxyMiddleware({
    target: ORDERS_TARGET,
    changeOrigin: true,
    pathRewrite: { '^/api/orders': '/orders' } 
}));

// Quy tắc cho Discounts của Service Order
app.use('/api/discounts', createProxyMiddleware({
    target: ORDERS_TARGET,
    changeOrigin: true,
    pathRewrite: { '^/api/discounts': '/discounts' }
}));
// Quy tắc cho Payment của VNPay
app.use('/api/payments', createProxyMiddleware({ 
    target: ORDERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/payments': '/payments' } 
}));

app.use('/api/internal', createProxyMiddleware({ 
    target: USERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/internal': '/internal' } 
}));

app.use('/api/users-stats', createProxyMiddleware({ 
    target: USERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/users-stats': '/users-stats' } 
}));

app.use('/api/orders-stats', createProxyMiddleware({ 
    target: ORDERS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/orders-stats': '/products-stats' } 
}));

app.use('/api/products-stats', createProxyMiddleware({ 
    target: PRODUCTS_TARGET, 
    changeOrigin: true, 
    pathRewrite: { '^/api/products-stats': '/orders-stats' } 
}));

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});