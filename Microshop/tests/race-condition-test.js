/**
 * TEST SCRIPT: Race Condition trong Order Creation
 *
 * Script này test xem hệ thống có thể handle concurrent orders không
 * bằng cách gửi nhiều requests đồng thời cho cùng 1 sản phẩm với stock giới hạn.
 *
 * Expected behavior:
 * - Chỉ có số lượng orders đủ stock được tạo thành công
 * - Các orders vượt quá stock sẽ bị reject
 * - Stock cuối cùng phải = stock ban đầu - tổng orders thành công
 */

const axios = require('axios');

// Config
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8000';
const TEST_VARIANT_ID = process.env.TEST_VARIANT_ID; // Phải set variant ID từ DB
const INITIAL_STOCK = 10; // Stock ban đầu của variant
const CONCURRENT_ORDERS = 15; // Số orders đồng thời (> INITIAL_STOCK để test)
const ITEMS_PER_ORDER = 2; // Số items mỗi order

// Mock order data
function createMockOrder(variantId) {
    return {
        orderItems: [
            {
                name: 'Test Product',
                price: 100000,
                quantity: ITEMS_PER_ORDER,
                image: 'https://example.com/image.jpg',
                variant: variantId,
                product: '507f1f77bcf86cd799439011' // Mock product ID
            }
        ],
        shippingInfo: {
            address: '123 Test Street',
            city: 'Test City',
            phoneNo: '0123456789',
            postalCode: '10000'
        },
        paymentInfo: {
            id: `test_${Date.now()}_${Math.random()}`,
            status: 'pending'
        },
        guestEmail: `test_${Date.now()}_${Math.random()}@example.com`,
        guestName: 'Test User',
        idempotencyKey: `test_${Date.now()}_${Math.random()}`
    };
}

// Test concurrent orders
async function testRaceCondition() {
    console.log('🚀 Starting Race Condition Test');
    console.log(`   Initial Stock: ${INITIAL_STOCK}`);
    console.log(`   Concurrent Orders: ${CONCURRENT_ORDERS}`);
    console.log(`   Items per Order: ${ITEMS_PER_ORDER}`);
    console.log(`   Expected Success: ${Math.floor(INITIAL_STOCK / ITEMS_PER_ORDER)} orders`);
    console.log('');

    if (!TEST_VARIANT_ID) {
        console.error('❌ TEST_VARIANT_ID environment variable is required!');
        console.log('   Usage: TEST_VARIANT_ID=<variant_id> node race-condition-test.js');
        process.exit(1);
    }

    const startTime = Date.now();
    const promises = [];

    // Tạo concurrent requests
    for (let i = 0; i < CONCURRENT_ORDERS; i++) {
        const orderData = createMockOrder(TEST_VARIANT_ID);
        const promise = axios.post(`${GATEWAY_URL}/api/orders`, orderData)
            .then(response => {
                return {
                    success: true,
                    orderId: response.data.data._id,
                    index: i
                };
            })
            .catch(error => {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    index: i
                };
            });

        promises.push(promise);
    }

    // Chờ tất cả requests hoàn thành
    const results = await Promise.all(promises);
    const endTime = Date.now();

    // Phân tích kết quả
    const successOrders = results.filter(r => r.success);
    const failedOrders = results.filter(r => !r.success);

    console.log('📊 TEST RESULTS:');
    console.log('═'.repeat(60));
    console.log(`✅ Successful Orders: ${successOrders.length}`);
    console.log(`❌ Failed Orders: ${failedOrders.length}`);
    console.log(`⏱️  Total Time: ${endTime - startTime}ms`);
    console.log('');

    // Expected vs Actual
    const expectedSuccess = Math.floor(INITIAL_STOCK / ITEMS_PER_ORDER);
    const totalItemsOrdered = successOrders.length * ITEMS_PER_ORDER;
    const expectedStock = INITIAL_STOCK - totalItemsOrdered;

    console.log('📈 ANALYSIS:');
    console.log('═'.repeat(60));
    console.log(`Expected Successful Orders: ${expectedSuccess}`);
    console.log(`Actual Successful Orders: ${successOrders.length}`);
    console.log(`Total Items Ordered: ${totalItemsOrdered}`);
    console.log(`Expected Remaining Stock: ${expectedStock}`);
    console.log('');

    // Check for overselling (CRITICAL BUG)
    if (totalItemsOrdered > INITIAL_STOCK) {
        console.log('🔴 CRITICAL: OVERSELLING DETECTED!');
        console.log(`   Ordered ${totalItemsOrdered} items but only had ${INITIAL_STOCK} in stock`);
        console.log('   ❌ Race condition NOT fixed!');
    } else if (expectedStock >= 0) {
        console.log('✅ PASS: No overselling detected');
        console.log('   ✅ Race condition properly handled!');
    }

    // Show failed orders reasons
    if (failedOrders.length > 0) {
        console.log('');
        console.log('❌ FAILED ORDERS REASONS:');
        console.log('═'.repeat(60));
        failedOrders.slice(0, 5).forEach(order => {
            console.log(`   Order #${order.index}: ${order.error}`);
        });
        if (failedOrders.length > 5) {
            console.log(`   ... and ${failedOrders.length - 5} more`);
        }
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log('🏁 Test Completed');
}

// Run test
testRaceCondition().catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
});
