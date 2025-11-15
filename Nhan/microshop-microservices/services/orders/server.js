// service-orders/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Kết nối DB
connectDatabase();
// Kết nối Redis (đã được xử lý trong file redis.js)
require('./redis');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const discountRoutes = require('./routes/discountRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Routers
app.use('/orders', orderRoutes);
app.use('/discounts', discountRoutes);
app.use('/payments', paymentRoutes);
app.use('/orders-stats', statsRoutes);
// Health check
app.get('/health', (_, res) => res.json({ ok: true, service: 'orders' }));

const PORT = process.env.PORT || 8003;
const server = app.listen(PORT, () => console.log(`🛒 Order Service running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});