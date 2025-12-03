// service-orders/redis.js

const redis = require('redis');

const publisher = redis.createClient({ url: process.env.REDIS_URL });

// ✅ FIX: Enhanced Redis error handling
publisher.on('error', (err) => {
    console.error('❌ Redis Publisher Error:', err);
});

publisher.on('reconnecting', () => {
    console.log('🔄 Redis Publisher reconnecting...');
});

publisher.on('ready', () => {
    console.log('✅ Redis Publisher ready');
});

(async () => {
    try {
        await publisher.connect();
        console.log('✅ Redis publisher connected.');
    } catch (err) {
        console.error('❌ Failed to connect Redis Publisher:', err);
        console.log('⚠️  Orders service will run without Redis publishing');
    }
})();

// Xuất ra publisher để controller có thể dùng
module.exports = { publisher };