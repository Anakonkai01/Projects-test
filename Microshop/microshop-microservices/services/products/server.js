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

(async () => {
    await subscriber.connect();
    console.log('Redis subscriber connected.');

    await subscriber.subscribe('order-events', async (message) => {
        const data = JSON.parse(message);
        console.log('📬 Received event from order-events channel:', data.type);
        
        if (data.type === 'ORDER_CREATED') {
            const { items } = data.payload;
            // Lặp qua các sản phẩm trong đơn hàng để trừ kho và cộng sold
            for (const item of items) {
                try {
                    // --- BẮT ĐẦU THAY ĐỔI TỪ ĐÂY ---
                    await Product.updateOne(
                        { "variants._id": item.variant }, // Tìm product chứa variant tương ứng
                        { 
                            $inc: { 
                                "variants.$.stock": -item.quantity, // Trừ số lượng tồn kho
                                "variants.$.sold": item.quantity,   // Tăng số lượng đã bán của biến thể
                                "sold": item.quantity               // Tăng tổng số lượng đã bán của sản phẩm
                            } 
                        }
                    );
                    // --- KẾT THÚC THAY ĐỔI ---
                    console.log(`Updated stock and sales for variant ${item.variant}`);
                } catch (err) {
                    console.error(`Failed to update stock for variant ${item.variant}:`, err);
                }
            }
        }
    });
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