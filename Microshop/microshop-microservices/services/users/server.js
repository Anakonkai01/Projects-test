// service-users/server.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const redis = require('redis'); 
// Load env vars

const passport = require('passport');
const connectDatabase = require('./config/db'); 
const User = require('./models/userModel');
const sendEmail = require('./utils/sendEmail');
// Kết nối DB
connectDatabase();
const subscriber = redis.createClient({ url: process.env.REDIS_URL });

(async () => {
    try {
        await subscriber.connect();
        console.log('Redis subscriber connected for loyalty points.');
        
        await subscriber.subscribe('payment-events', async (message) => {
            try {
                const data = JSON.parse(message);
                console.log('💳 Received event from payment-events channel:', data.type);
                
                if (data.type === 'PAYMENT_SUCCESSFUL') {
                    const { userId, totalPrice } = data.payload;
                    const pointsEarned = Math.floor(totalPrice / 10000);

                    if (pointsEarned > 0 ) {
                        await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: pointsEarned } });
                        console.log(`✅ Added ${pointsEarned} points to user ${userId}`);
                    }
                }
            } catch (err) {
                console.error('Error processing payment event:', err);
            }
        });
    } catch (err) {
        console.error('Failed to connect to Redis subscriber:', err);
    }
})();

const emailSubscriber = redis.createClient({ url: process.env.REDIS_URL });

(async () => {
    try {
        await emailSubscriber.connect();
        console.log('Redis subscriber connected for email events.');
        
        await emailSubscriber.subscribe('email-events', async (message) => {
            try {
                const data = JSON.parse(message);
                console.log('📧 Received event from email-events channel:', data.type);
                
                if (data.type === 'SEND_ORDER_CONFIRMATION') {
                    const { userId, order } = data.payload;
                    
                    const user = await User.findById(userId);
                    if (!user) {
                        console.error(`User not found for sending email: ${userId}`);
                        return;
                    }

                    // Tạo nội dung email
                    const emailMessage = `
                        <h1>Xác nhận đơn hàng #${order._id}</h1>
                        <p>Chào ${user.name},</p>
                        <p>Cảm ơn bạn đã đặt hàng tại Microshop. Giao dịch của bạn đã hoàn tất và đơn hàng đã được xác nhận.</p>
                        <h3>Chi tiết đơn hàng:</h3>
                        <ul>
                            ${order.orderItems.map(item => `<li>${item.name} x ${item.quantity} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</li>`).join('')}
                        </ul>
                        <p style="font-size: 1.1em;"><strong>Tổng cộng: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</strong></p>
                        <h3>Thông tin giao hàng:</h3>
                        <p>
                            ${order.shippingInfo.address}, ${order.shippingInfo.city}<br>
                            SĐT: ${order.shippingInfo.phoneNo}
                        </p>
                        <p>Cảm ơn bạn đã tin tưởng và mua sắm tại Microshop!</p>
                    `;

                    // Gửi email
                    await sendEmail({
                        email: user.email,
                        subject: `Xác nhận đơn hàng #${order._id} thành công`,
                        message: emailMessage
                    });

                    console.log(`✅ Sent order confirmation email to ${user.email} for order ${order._id}`);
                }
            } catch (err) {
                console.error('Error processing email event:', err);
            }
        });
    } catch (err) {
        console.error('Failed to connect to Redis email subscriber:', err);
    }
})();

// Import routes
const authRoutes = require('./routes/authRoutes'); // user and admin
const userRoutes = require('./routes/userRoutes'); // admin - manage user 
const internalRoutes = require('./routes/internalRoutes');
const statsRoutes = require('./routes/statsRoutes');
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Khởi tạo Passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/auth', authRoutes); // routes for users
app.use('/users', userRoutes); // routes for admin
app.use('/internal', internalRoutes);
app.use('/users-stats', statsRoutes);

// Health check route
app.get('/health', (_, res) => res.json({ ok: true, service: 'users' }));


const PORT = process.env.USERS_PORT || 8001;
const server = app.listen(PORT, () => console.log(`👥 User Service running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});