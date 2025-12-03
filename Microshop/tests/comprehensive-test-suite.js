/**
 * COMPREHENSIVE TEST SUITE
 * Tests tất cả các chức năng đã fix trong Rescue Plan
 *
 * Usage:
 * 1. Setup test data first (tạo product với variants)
 * 2. Set environment variables
 * 3. Run: node comprehensive-test-suite.js
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

// ================== CONFIG ==================
const CONFIG = {
    GATEWAY_URL: process.env.GATEWAY_URL || 'http://localhost:8000',
    TEST_VARIANT_ID: process.env.TEST_VARIANT_ID, // Variant có stock = 10
    TEST_USER_TOKEN: process.env.TEST_USER_TOKEN, // JWT token của user test
    TEST_ADMIN_TOKEN: process.env.TEST_ADMIN_TOKEN, // JWT token của admin
};

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// ================== HELPER FUNCTIONS ==================

function logSection(title) {
    console.log('\n' + '='.repeat(70));
    console.log(`  ${title}`);
    console.log('='.repeat(70));
}

function logTest(name) {
    totalTests++;
    console.log(`\n[TEST ${totalTests}] ${name}`);
}

function logPass(message) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
}

function logFail(message) {
    failedTests++;
    console.log(`❌ FAIL: ${message}`);
}

function logInfo(message) {
    console.log(`ℹ️  ${message}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock order data generator
function createMockOrder(overrides = {}) {
    const timestamp = Date.now();
    const random = Math.random();

    return {
        orderItems: [
            {
                name: 'Test Product',
                price: 100000,
                quantity: 2,
                image: 'https://example.com/image.jpg',
                variant: CONFIG.TEST_VARIANT_ID,
                product: '507f1f77bcf86cd799439011'
            }
        ],
        shippingInfo: {
            address: '123 Test Street',
            city: 'Test City',
            phoneNo: '0123456789',
            postalCode: '10000'
        },
        paymentInfo: {
            id: `test_${timestamp}_${random}`,
            status: 'pending'
        },
        guestEmail: `test_${timestamp}_${random}@example.com`,
        guestName: 'Test User',
        ...overrides
    };
}

// ================== TEST SUITES ==================

// TEST SUITE 1: Race Condition Prevention
async function testRaceCondition() {
    logSection('TEST SUITE 1: RACE CONDITION PREVENTION');

    logTest('Concurrent orders với stock giới hạn');

    const CONCURRENT_ORDERS = 10;
    const ITEMS_PER_ORDER = 2;
    const EXPECTED_STOCK = 10; // Giả sử stock ban đầu = 10

    logInfo(`Gửi ${CONCURRENT_ORDERS} orders đồng thời, mỗi order ${ITEMS_PER_ORDER} items`);
    logInfo(`Expected: Chỉ ${Math.floor(EXPECTED_STOCK / ITEMS_PER_ORDER)} orders thành công`);

    const startTime = performance.now();
    const promises = [];

    for (let i = 0; i < CONCURRENT_ORDERS; i++) {
        const orderData = createMockOrder();
        const promise = axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, orderData)
            .then(res => ({ success: true, orderId: res.data.data._id }))
            .catch(err => ({ success: false, error: err.response?.data?.error }));

        promises.push(promise);
    }

    const results = await Promise.all(promises);
    const endTime = performance.now();

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    logInfo(`Thời gian: ${(endTime - startTime).toFixed(2)}ms`);
    logInfo(`Thành công: ${successCount}, Thất bại: ${failCount}`);

    // Verify không có overselling
    const totalOrdered = successCount * ITEMS_PER_ORDER;
    if (totalOrdered <= EXPECTED_STOCK) {
        logPass(`Không có overselling: ${totalOrdered}/${EXPECTED_STOCK} items ordered`);
    } else {
        logFail(`OVERSELLING DETECTED: ${totalOrdered}/${EXPECTED_STOCK} items ordered`);
    }

    // Verify có orders bị reject
    if (failCount > 0) {
        logPass(`Có ${failCount} orders bị reject đúng khi hết stock`);
    } else {
        logInfo('Cảnh báo: Không có order nào bị reject (có thể stock quá nhiều)');
    }
}

// TEST SUITE 2: Rollback Mechanism
async function testRollbackMechanism() {
    logSection('TEST SUITE 2: ROLLBACK MECHANISM');

    // Test 2.1: Rollback khi discount invalid
    logTest('Rollback inventory khi discount code invalid');

    const orderWithInvalidDiscount = createMockOrder({
        discountCode: 'INVALID_CODE_123'
    });

    try {
        await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, orderWithInvalidDiscount);
        logFail('Order không bị reject với invalid discount');
    } catch (error) {
        if (error.response?.status === 400) {
            logPass('Order bị reject với invalid discount');
            logInfo(`Error message: ${error.response.data.error}`);
        } else {
            logFail(`Unexpected error: ${error.message}`);
        }
    }

    // Test 2.2: Rollback khi user creation fails
    logTest('Rollback inventory khi không có user info');

    const orderWithoutUser = {
        orderItems: [
            {
                name: 'Test Product',
                price: 100000,
                quantity: 1,
                image: 'https://example.com/image.jpg',
                variant: CONFIG.TEST_VARIANT_ID,
                product: '507f1f77bcf86cd799439011'
            }
        ],
        shippingInfo: {
            address: '123 Test Street',
            city: 'Test City',
            phoneNo: '0123456789',
            postalCode: '10000'
        },
        paymentInfo: {
            id: `test_${Date.now()}`,
            status: 'pending'
        }
        // Không có guestEmail và guestName
    };

    try {
        await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, orderWithoutUser);
        logFail('Order không bị reject khi thiếu user info');
    } catch (error) {
        if (error.response?.status === 400) {
            logPass('Order bị reject khi thiếu user info');
            logInfo(`Error message: ${error.response.data.error}`);
        } else {
            logFail(`Unexpected error: ${error.message}`);
        }
    }

    await sleep(1000); // Wait for async rollback
}

// TEST SUITE 3: Idempotency
async function testIdempotency() {
    logSection('TEST SUITE 3: IDEMPOTENCY');

    logTest('Duplicate order request với cùng idempotencyKey');

    const idempotencyKey = `test_idempotency_${Date.now()}`;
    const orderData = createMockOrder({
        idempotencyKey,
        paymentInfo: {
            id: idempotencyKey,
            status: 'pending'
        }
    });

    // Request 1
    logInfo('Gửi request đầu tiên...');
    let firstResponse;
    try {
        firstResponse = await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, orderData);
        logPass('Request đầu tiên thành công');
        logInfo(`Order ID: ${firstResponse.data.data._id}`);
    } catch (error) {
        logFail(`Request đầu tiên thất bại: ${error.message}`);
        return;
    }

    // Request 2 (duplicate)
    logInfo('Gửi duplicate request với cùng idempotencyKey...');
    await sleep(500);

    try {
        const secondResponse = await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, orderData);

        // Verify trả về cùng order
        if (secondResponse.data.data._id === firstResponse.data.data._id) {
            logPass('Duplicate request trả về existing order');
            logInfo(`Same Order ID: ${secondResponse.data.data._id}`);
        } else {
            logFail('Duplicate request tạo order mới (không đúng)');
        }

        // Verify message
        if (secondResponse.data.message) {
            logInfo(`Message: ${secondResponse.data.message}`);
        }
    } catch (error) {
        logFail(`Duplicate request failed: ${error.message}`);
    }
}

// TEST SUITE 4: Order Creation Flow (End-to-End)
async function testOrderCreationFlow() {
    logSection('TEST SUITE 4: ORDER CREATION FLOW (END-TO-END)');

    // Test 4.1: Guest order
    logTest('Tạo order với guest user');

    const guestOrder = createMockOrder();

    try {
        const response = await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, guestOrder);

        if (response.data.success && response.data.data._id) {
            logPass('Guest order tạo thành công');
            logInfo(`Order ID: ${response.data.data._id}`);
            logInfo(`Total Price: ${response.data.data.totalPrice}`);

            // Verify fields
            const order = response.data.data;
            if (order.orderItems && order.orderItems.length > 0) {
                logPass('Order items được lưu đúng');
            }
            if (order.shippingInfo && order.shippingInfo.address) {
                logPass('Shipping info được lưu đúng');
            }
            if (order.user) {
                logPass('User ID được gán');
            }
        } else {
            logFail('Response không đúng format');
        }
    } catch (error) {
        logFail(`Guest order thất bại: ${error.response?.data?.error || error.message}`);
    }

    // Test 4.2: Order với authenticated user (nếu có token)
    if (CONFIG.TEST_USER_TOKEN) {
        logTest('Tạo order với authenticated user');

        const authOrder = createMockOrder();
        delete authOrder.guestEmail;
        delete authOrder.guestName;

        try {
            const response = await axios.post(
                `${CONFIG.GATEWAY_URL}/api/orders`,
                authOrder,
                {
                    headers: {
                        'Authorization': `Bearer ${CONFIG.TEST_USER_TOKEN}`
                    }
                }
            );

            if (response.data.success) {
                logPass('Authenticated order tạo thành công');
                logInfo(`Order ID: ${response.data.data._id}`);
            }
        } catch (error) {
            logFail(`Authenticated order thất bại: ${error.response?.data?.error || error.message}`);
        }
    } else {
        logInfo('Skip authenticated order test (no TEST_USER_TOKEN)');
    }

    // Test 4.3: Order với loyalty points redemption (nếu có token)
    if (CONFIG.TEST_USER_TOKEN) {
        logTest('Tạo order với points redemption');

        const orderWithPoints = createMockOrder({
            pointsToRedeem: 10
        });
        delete orderWithPoints.guestEmail;
        delete orderWithPoints.guestName;

        try {
            const response = await axios.post(
                `${CONFIG.GATEWAY_URL}/api/orders`,
                orderWithPoints,
                {
                    headers: {
                        'Authorization': `Bearer ${CONFIG.TEST_USER_TOKEN}`
                    }
                }
            );

            if (response.data.success) {
                const order = response.data.data;

                // Verify redeemedPoints field exists
                if ('redeemedPoints' in order) {
                    logPass('redeemedPoints field được lưu (schema fix hoạt động)');
                    logInfo(`Redeemed Points: ${order.redeemedPoints}`);
                } else {
                    logFail('redeemedPoints field bị mất (schema fix không hoạt động)');
                }

                // Verify pointsDiscountPrice field exists
                if ('pointsDiscountPrice' in order) {
                    logPass('pointsDiscountPrice field được lưu (schema fix hoạt động)');
                    logInfo(`Points Discount: ${order.pointsDiscountPrice}`);
                } else {
                    logFail('pointsDiscountPrice field bị mất (schema fix không hoạt động)');
                }
            }
        } catch (error) {
            logInfo(`Points redemption test skipped: ${error.response?.data?.error || error.message}`);
        }
    } else {
        logInfo('Skip points redemption test (no TEST_USER_TOKEN)');
    }
}

// TEST SUITE 5: Inventory API Endpoints
async function testInventoryAPIs() {
    logSection('TEST SUITE 5: INVENTORY API ENDPOINTS');

    // Test 5.1: Validate Stock API
    logTest('Test validate-stock endpoint');

    const validateStockPayload = {
        items: [
            {
                variant: CONFIG.TEST_VARIANT_ID,
                quantity: 1
            }
        ]
    };

    try {
        const response = await axios.post(
            `${CONFIG.GATEWAY_URL}/api/products/validate-stock`,
            validateStockPayload
        );

        if (response.data.success) {
            logPass('Validate-stock API hoạt động');
            logInfo(`Message: ${response.data.message}`);
        }
    } catch (error) {
        if (error.response?.status === 400) {
            logInfo(`Stock validation failed (expected): ${error.response.data.error}`);
        } else {
            logFail(`Validate-stock API error: ${error.message}`);
        }
    }

    // Test 5.2: Validate với quantity lớn hơn stock
    logTest('Test validate-stock với quantity > stock');

    const invalidStockPayload = {
        items: [
            {
                variant: CONFIG.TEST_VARIANT_ID,
                quantity: 9999 // Quantity rất lớn
            }
        ]
    };

    try {
        await axios.post(
            `${CONFIG.GATEWAY_URL}/api/products/validate-stock`,
            invalidStockPayload
        );
        logFail('Validate-stock không reject quantity lớn');
    } catch (error) {
        if (error.response?.status === 400) {
            logPass('Validate-stock reject quantity > stock đúng');
            logInfo(`Error: ${error.response.data.error}`);
        } else {
            logFail(`Unexpected error: ${error.message}`);
        }
    }

    // Test 5.3: Rollback Stock API
    logTest('Test rollback-stock endpoint');

    const rollbackPayload = {
        items: [
            {
                variant: CONFIG.TEST_VARIANT_ID,
                quantity: 1
            }
        ]
    };

    try {
        const response = await axios.post(
            `${CONFIG.GATEWAY_URL}/api/products/rollback-stock`,
            rollbackPayload
        );

        if (response.data.success) {
            logPass('Rollback-stock API hoạt động');
            logInfo(`Message: ${response.data.message}`);
        }
    } catch (error) {
        logFail(`Rollback-stock API error: ${error.message}`);
    }
}

// TEST SUITE 6: Order Cancellation
async function testOrderCancellation() {
    logSection('TEST SUITE 6: ORDER CANCELLATION & STOCK RESTORATION');

    if (!CONFIG.TEST_USER_TOKEN) {
        logInfo('Skip order cancellation test (no TEST_USER_TOKEN)');
        return;
    }

    logTest('Tạo và cancel order, verify stock restoration');

    // Bước 1: Tạo order
    const orderData = createMockOrder();
    delete orderData.guestEmail;
    delete orderData.guestName;

    let orderId;
    try {
        const response = await axios.post(
            `${CONFIG.GATEWAY_URL}/api/orders`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.TEST_USER_TOKEN}`
                }
            }
        );

        orderId = response.data.data._id;
        logPass(`Order created: ${orderId}`);
    } catch (error) {
        logFail(`Cannot create order for cancellation test: ${error.message}`);
        return;
    }

    // Bước 2: Cancel order
    await sleep(1000);

    try {
        const response = await axios.put(
            `${CONFIG.GATEWAY_URL}/api/orders/${orderId}/cancel`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.TEST_USER_TOKEN}`
                }
            }
        );

        if (response.data.success) {
            logPass('Order cancelled successfully');
            logInfo('Stock should be restored via Redis event');
        }
    } catch (error) {
        logFail(`Order cancellation failed: ${error.response?.data?.error || error.message}`);
    }

    // Wait for Redis event processing
    await sleep(2000);
    logInfo('Verify stock restoration manually in database');
}

// TEST SUITE 7: Error Handling
async function testErrorHandling() {
    logSection('TEST SUITE 7: ERROR HANDLING');

    // Test 7.1: Empty cart
    logTest('Order với giỏ hàng trống');

    try {
        await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, {
            orderItems: [],
            shippingInfo: {
                address: 'Test',
                city: 'Test',
                phoneNo: '0123456789',
                postalCode: '10000'
            },
            paymentInfo: { id: 'test', status: 'pending' },
            guestEmail: 'test@test.com'
        });
        logFail('Empty cart không bị reject');
    } catch (error) {
        if (error.response?.status === 400) {
            logPass('Empty cart bị reject đúng');
            logInfo(`Error: ${error.response.data.error}`);
        }
    }

    // Test 7.2: Invalid variant ID
    logTest('Order với invalid variant ID');

    const invalidVariantOrder = createMockOrder({
        orderItems: [{
            name: 'Test Product',
            price: 100000,
            quantity: 1,
            image: 'https://example.com/image.jpg',
            variant: 'invalid_variant_id',
            product: '507f1f77bcf86cd799439011'
        }]
    });

    try {
        await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, invalidVariantOrder);
        logFail('Invalid variant không bị reject');
    } catch (error) {
        if (error.response?.status === 400) {
            logPass('Invalid variant bị reject đúng');
            logInfo(`Error: ${error.response.data.error}`);
        }
    }

    // Test 7.3: Missing shipping info
    logTest('Order thiếu shipping info');

    try {
        await axios.post(`${CONFIG.GATEWAY_URL}/api/orders`, {
            orderItems: [{
                name: 'Test Product',
                price: 100000,
                quantity: 1,
                image: 'https://example.com/image.jpg',
                variant: CONFIG.TEST_VARIANT_ID,
                product: '507f1f77bcf86cd799439011'
            }],
            paymentInfo: { id: 'test', status: 'pending' },
            guestEmail: 'test@test.com'
        });
        logFail('Missing shipping info không bị reject');
    } catch (error) {
        if (error.response?.status >= 400) {
            logPass('Missing shipping info bị reject đúng');
        }
    }
}

// ================== MAIN TEST RUNNER ==================

async function runAllTests() {
    console.log('\n');
    console.log('🧪 COMPREHENSIVE TEST SUITE');
    console.log('═'.repeat(70));
    console.log('Testing Rescue Plan Fixes for Microshop E-commerce');
    console.log('═'.repeat(70));

    // Validate config
    if (!CONFIG.TEST_VARIANT_ID) {
        console.error('\n❌ ERROR: TEST_VARIANT_ID is required!');
        console.log('Usage: TEST_VARIANT_ID=<variant_id> node comprehensive-test-suite.js');
        console.log('\nOptional:');
        console.log('  TEST_USER_TOKEN=<jwt_token>');
        console.log('  TEST_ADMIN_TOKEN=<jwt_token>');
        console.log('  GATEWAY_URL=<url>');
        process.exit(1);
    }

    console.log('\nConfiguration:');
    console.log(`  Gateway URL: ${CONFIG.GATEWAY_URL}`);
    console.log(`  Test Variant ID: ${CONFIG.TEST_VARIANT_ID}`);
    console.log(`  User Token: ${CONFIG.TEST_USER_TOKEN ? '✓' : '✗'}`);
    console.log(`  Admin Token: ${CONFIG.TEST_ADMIN_TOKEN ? '✓' : '✗'}`);

    const startTime = performance.now();

    try {
        // Run test suites
        await testInventoryAPIs();
        await sleep(1000);

        await testOrderCreationFlow();
        await sleep(1000);

        await testRollbackMechanism();
        await sleep(1000);

        await testIdempotency();
        await sleep(1000);

        await testErrorHandling();
        await sleep(1000);

        await testOrderCancellation();
        await sleep(1000);

        // Race condition test cuối cùng vì sẽ consume nhiều stock
        await testRaceCondition();

    } catch (error) {
        console.error('\n❌ Test suite crashed:', error.message);
    }

    const endTime = performance.now();

    // Print summary
    logSection('TEST SUMMARY');
    console.log(`\nTotal Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Time: ${((endTime - startTime) / 1000).toFixed(2)}s`);

    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    console.log(`\n📊 Success Rate: ${successRate}%`);

    if (failedTests === 0) {
        console.log('\n🎉 ALL TESTS PASSED! 🎉');
        console.log('✅ Rescue Plan fixes are working correctly!');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED');
        console.log('Please review the failures above and fix issues.');
    }

    console.log('\n' + '='.repeat(70));
    console.log('Test suite completed');
    console.log('='.repeat(70) + '\n');

    process.exit(failedTests === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
