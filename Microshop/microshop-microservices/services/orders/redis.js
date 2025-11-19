// service-orders/redis.js

const redis = require('redis');

const publisher = redis.createClient({ url: process.env.REDIS_URL });

publisher.on('error', (err) => console.log('Redis Publisher Error', err));

(async () => {
    await publisher.connect();
    console.log('Redis publisher connected.');
})();

// Xuất ra publisher để controller có thể dùng
module.exports = { publisher };