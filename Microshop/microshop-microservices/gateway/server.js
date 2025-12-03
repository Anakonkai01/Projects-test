const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Load env vars
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.GATEWAY_PORT || 9000;

// Định nghĩa target từ biến môi trường
const USERS_TARGET = process.env.USERS_TARGET || 'http://localhost:8001';
const PRODUCTS_TARGET = process.env.PRODUCTS_TARGET || 'http://localhost:8002';
const ORDERS_TARGET = process.env.ORDERS_TARGET || 'http://localhost:8003';

console.log('Setting up proxy routes...');
console.log('USERS_TARGET:', USERS_TARGET);
console.log('PRODUCTS_TARGET:', PRODUCTS_TARGET);
console.log('ORDERS_TARGET:', ORDERS_TARGET);

// --- MIDDLEWARE CHUNG ---
app.use(cors());
app.use(morgan('tiny'));

// Route kiểm tra sức khỏe của gateway
app.get('/health', (_, res) => res.json({ ok: true, service: 'gateway' }));

// --- PROXY CONFIGURATION với http-proxy-middleware v3 syntax ---

// Users Stats Proxy - target includes base path since Express strips mount point
const usersStatsProxy = createProxyMiddleware({
    target: `${USERS_TARGET}/users-stats`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Users-Stats] ${req.method} ${req.originalUrl} -> ${USERS_TARGET}/users-stats${req.url}`);
        }
    }
});

// Orders Stats Proxy
const ordersStatsProxy = createProxyMiddleware({
    target: `${ORDERS_TARGET}/orders-stats`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Orders-Stats] ${req.method} ${req.originalUrl} -> ${ORDERS_TARGET}/orders-stats${req.url}`);
        }
    }
});

// Products Stats Proxy
const productsStatsProxy = createProxyMiddleware({
    target: `${PRODUCTS_TARGET}/products-stats`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Products-Stats] ${req.method} ${req.originalUrl} -> ${PRODUCTS_TARGET}/products-stats${req.url}`);
        }
    }
});

// Auth Proxy
const authProxy = createProxyMiddleware({
    target: `${USERS_TARGET}/auth`,
    changeOrigin: true
});

// Users Auth Proxy (legacy path support: /api/users/auth/* -> /auth/*)
const usersAuthProxy = createProxyMiddleware({
    target: `${USERS_TARGET}/auth`,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users/auth': '/auth'
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Users-Auth-Legacy] ${req.method} ${req.originalUrl} -> ${USERS_TARGET}/auth${req.url.replace('/api/users/auth', '')}`);
        }
    }
});

// Users Proxy
const usersProxy = createProxyMiddleware({
    target: `${USERS_TARGET}/users`,
    changeOrigin: true
});

// Products Proxy - target includes base path since Express strips mount point
const productsProxy = createProxyMiddleware({
    target: `${PRODUCTS_TARGET}/products_ser`,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`[Products] ${req.method} ${req.originalUrl} -> ${PRODUCTS_TARGET}/products_ser${req.url}`);
        }
    }
});

// Orders Proxy
const ordersProxy = createProxyMiddleware({
    target: `${ORDERS_TARGET}/orders`,
    changeOrigin: true
});

// Discounts Proxy
const discountsProxy = createProxyMiddleware({
    target: `${ORDERS_TARGET}/discounts`,
    changeOrigin: true
});

// Payments Proxy
const paymentsProxy = createProxyMiddleware({
    target: `${ORDERS_TARGET}/payments`,
    changeOrigin: true
});

// Internal Proxy
const internalProxy = createProxyMiddleware({
    target: `${USERS_TARGET}/internal`,
    changeOrigin: true
});

// --- MOUNT ROUTES (Thứ tự quan trọng - specific routes trước) ---

// Stats routes PHẢI đặt trước các routes chính
app.use('/api/users-stats', usersStatsProxy);
app.use('/api/orders-stats', ordersStatsProxy);
app.use('/api/products-stats', productsStatsProxy);

// Main routes
app.use('/api/users/auth', usersAuthProxy);  // Legacy path support - MUST be before /api/users
app.use('/api/auth', authProxy);
app.use('/api/users', usersProxy);
app.use('/api/products', productsProxy);
app.use('/api/orders', ordersProxy);
app.use('/api/discounts', discountsProxy);
app.use('/api/payments', paymentsProxy);
app.use('/api/internal', internalProxy);

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});