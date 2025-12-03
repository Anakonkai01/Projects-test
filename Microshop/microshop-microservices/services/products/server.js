// service-products/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./config/db');
const redis = require('redis');
const Product = require('./models/productModel'); // Import model để cập nhật kho
const statsRoutes = require('./routes/statsRoutes');
dotenv.config({path: './.env'});

connectDatabase();

// change from redis to redis stream
// --- REDIS SUBSCRIBER CHO VIỆC TRỪ KHO ---
const subscriber = redis.createClient({ url: process.env.REDIS_URL });

// ✅ FIX: Add Redis error handling
subscriber.on('error', (err) => {
    console.error('❌ Redis Subscriber Error:', err);
});

subscriber.on('reconnecting', () => {
    console.log('🔄 Redis Subscriber reconnecting...');
});

subscriber.on('ready', () => {
    console.log('✅ Redis Subscriber ready');
});

(async () => {
    try {
        await subscriber.connect();
        console.log('✅ Redis subscriber connected.');

        await subscriber.subscribe('order-events', async (message) => {
        const data = JSON.parse(message);
        console.log('📬 Received event from order-events channel:', data.type);

        // ORDER_CREATED event đã được xử lý bởi validateAndReserveStock API
        // Giữ lại ORDER_CANCELLED để restore stock khi user hủy đơn
        if (data.type === 'ORDER_CANCELLED') {
            const { items } = data.payload;
            console.log('🔄 Processing ORDER_CANCELLED - restoring stock...');

            for (const item of items) {
                try {
                    await Product.updateOne(
                        { "variants._id": item.variant },
                        {
                            $inc: {
                                "variants.$.stock": item.quantity,   // Hoàn trả stock
                                "variants.$.sold": -item.quantity,   // Trừ sold
                                "sold": -item.quantity
                            }
                        }
                    );
                    console.log(`✅ Restored ${item.quantity} units for variant ${item.variant}`);
                } catch (err) {
                    console.error(`❌ Failed to restore stock for variant ${item.variant}:`, err);
                }
            }
        }
    });
    } catch (err) {
        console.error('❌ Failed to connect Redis Subscriber:', err);
        console.log('⚠️  Products service will run without Redis event handling');
    }
})();


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Import & Mount Routers
const productRoutes = require('./routes/productRoutes');
app.use('/products_ser', productRoutes);
app.use('/products-stats', statsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error caught in middleware:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 9002;
app.listen(PORT, () => console.log(`📦 Product Service running on port ${PORT}`));