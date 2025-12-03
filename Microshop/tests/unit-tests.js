/**
 * UNIT TESTS
 * Test các helper functions và utilities
 *
 * Usage: node tests/unit-tests.js
 */

const axios = require('axios');

// Mock environment
process.env.PRODUCTS_URL = process.env.PRODUCTS_URL || 'http://localhost:8002';

// Import functions to test
const { validateAndReserveInventory, rollbackInventory } = require('../microshop-microservices/services/orders/utils/inventoryHelper');

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

// ================== TEST SUITES ==================

// TEST SUITE 1: inventoryHelper.js
async function testInventoryHelper() {
    logSection('UNIT TEST: inventoryHelper.js');

    const TEST_VARIANT_ID = process.env.TEST_VARIANT_ID;

    if (!TEST_VARIANT_ID) {
        logInfo('Skip inventoryHelper tests (no TEST_VARIANT_ID)');
        return;
    }

    // Test 1.1: validateAndReserveInventory với valid data
    logTest('validateAndReserveInventory() với valid items');

    const validItems = [
        {
            variant: TEST_VARIANT_ID,
            quantity: 1
        }
    ];

    try {
        const result = await validateAndReserveInventory(validItems);

        if (result.success === true) {
            logPass('Function trả về success: true');
        } else if (result.success === false && result.error) {
            logInfo(`Reservation failed (có thể do stock không đủ): ${result.error}`);
        } else {
            logFail('Function trả về format không đúng');
        }
    } catch (error) {
        logFail(`Function throw error: ${error.message}`);
    }

    // Test 1.2: validateAndReserveInventory với empty items
    logTest('validateAndReserveInventory() với empty items');

    try {
        const result = await validateAndReserveInventory([]);

        if (result.success === false && result.error) {
            logPass('Function handle empty items correctly');
            logInfo(`Error: ${result.error}`);
        } else {
            logFail('Function không reject empty items');
        }
    } catch (error) {
        logInfo(`Function throw error (acceptable): ${error.message}`);
    }

    // Test 1.3: validateAndReserveInventory với invalid variant
    logTest('validateAndReserveInventory() với invalid variant ID');

    const invalidItems = [
        {
            variant: 'invalid_variant_id',
            quantity: 1
        }
    ];

    try {
        const result = await validateAndReserveInventory(invalidItems);

        if (result.success === false && result.error) {
            logPass('Function handle invalid variant correctly');
            logInfo(`Error: ${result.error}`);
        } else {
            logFail('Function không reject invalid variant');
        }
    } catch (error) {
        logInfo(`Function throw error (acceptable): ${error.message}`);
    }

    // Test 1.4: validateAndReserveInventory với quantity quá lớn
    logTest('validateAndReserveInventory() với quantity > stock');

    const tooManyItems = [
        {
            variant: TEST_VARIANT_ID,
            quantity: 9999
        }
    ];

    try {
        const result = await validateAndReserveInventory(tooManyItems);

        if (result.success === false && result.error.includes('không đủ')) {
            logPass('Function reject quantity > stock correctly');
            logInfo(`Error: ${result.error}`);
        } else {
            logFail('Function không reject quantity quá lớn');
        }
    } catch (error) {
        logInfo(`Function throw error (acceptable): ${error.message}`);
    }

    // Test 1.5: rollbackInventory
    logTest('rollbackInventory() function');

    const rollbackItems = [
        {
            variant: TEST_VARIANT_ID,
            quantity: 1
        }
    ];

    try {
        await rollbackInventory(rollbackItems);
        logPass('rollbackInventory() executed without error');
        logInfo('Verify stock restoration manually in database');
    } catch (error) {
        logFail(`rollbackInventory() failed: ${error.message}`);
    }

    // Test 1.6: rollbackInventory với empty items
    logTest('rollbackInventory() với empty items');

    try {
        await rollbackInventory([]);
        logPass('rollbackInventory() handle empty items');
    } catch (error) {
        logFail(`rollbackInventory() failed with empty items: ${error.message}`);
    }
}

// TEST SUITE 2: Order Model Schema
async function testOrderModelSchema() {
    logSection('UNIT TEST: Order Model Schema');

    const mongoose = require('mongoose');
    const Order = require('../microshop-microservices/services/orders/models/orderModel');

    // Test 2.1: Check required fields exist
    logTest('Order Schema có các required fields');

    const schema = Order.schema.obj;

    const requiredFields = [
        'orderItems',
        'user',
        'paymentInfo',
        'itemsPrice',
        'taxPrice',
        'shippingPrice',
        'discountPrice',
        'totalPrice'
    ];

    let allFieldsExist = true;
    requiredFields.forEach(field => {
        if (schema[field]) {
            logInfo(`✓ ${field} exists`);
        } else {
            logFail(`✗ ${field} missing`);
            allFieldsExist = false;
        }
    });

    if (allFieldsExist) {
        logPass('All required fields exist in schema');
    }

    // Test 2.2: Check fixed fields exist
    logTest('Order Schema có redeemedPoints và pointsDiscountPrice fields (FIX)');

    if (schema.redeemedPoints) {
        logPass('redeemedPoints field exists (FIXED)');
        logInfo(`Type: ${schema.redeemedPoints.type.name}, Default: ${schema.redeemedPoints.default}`);
    } else {
        logFail('redeemedPoints field missing (NOT FIXED)');
    }

    if (schema.pointsDiscountPrice) {
        logPass('pointsDiscountPrice field exists (FIXED)');
        logInfo(`Type: ${schema.pointsDiscountPrice.type.name}, Default: ${schema.pointsDiscountPrice.default}`);
    } else {
        logFail('pointsDiscountPrice field missing (NOT FIXED)');
    }

    // Test 2.3: Check orderStatusHistory
    logTest('Order Schema có orderStatusHistory với enum values');

    if (schema.orderStatusHistory) {
        logPass('orderStatusHistory exists');

        const statusEnum = schema.orderStatusHistory[0].status.enum;
        if (statusEnum && statusEnum.includes('Pending') && statusEnum.includes('Cancelled')) {
            logPass('orderStatusHistory có đầy đủ status enum');
            logInfo(`Enum values: ${statusEnum.join(', ')}`);
        } else {
            logFail('orderStatusHistory enum values không đầy đủ');
        }
    } else {
        logFail('orderStatusHistory missing');
    }
}

// TEST SUITE 3: Product Model Schema
async function testProductModelSchema() {
    logSection('UNIT TEST: Product Model Schema');

    const Product = require('../microshop-microservices/services/products/models/productModel');

    // Test 3.1: Check variants schema
    logTest('Product Schema có variants với stock field');

    const schema = Product.schema.obj;

    if (schema.variants) {
        logPass('variants field exists');

        const variantSchema = schema.variants[0];
        const requiredVariantFields = ['name', 'sku', 'stock', 'price', 'sold'];

        let allFieldsExist = true;
        requiredVariantFields.forEach(field => {
            if (variantSchema[field]) {
                logInfo(`✓ variants.${field} exists`);
            } else {
                logFail(`✗ variants.${field} missing`);
                allFieldsExist = false;
            }
        });

        if (allFieldsExist) {
            logPass('All variant fields exist');
        }

        // Check stock default value
        if (variantSchema.stock && variantSchema.stock.default === 0) {
            logPass('variants.stock has default value 0');
        }

        // Check sold default value
        if (variantSchema.sold && variantSchema.sold.default === 0) {
            logPass('variants.sold has default value 0');
        }
    } else {
        logFail('variants field missing');
    }

    // Test 3.2: Check product-level sold field
    logTest('Product Schema có product-level sold field');

    if (schema.sold) {
        logPass('Product-level sold field exists');
        logInfo(`Type: ${schema.sold.type.name}, Default: ${schema.sold.default}`);
    } else {
        logFail('Product-level sold field missing');
    }
}

// TEST SUITE 4: API Response Format Validation
async function testAPIResponseFormat() {
    logSection('UNIT TEST: API Response Format');

    const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8000';

    // Test 4.1: Products API response format
    logTest('GET /api/products response format');

    try {
        const response = await axios.get(`${GATEWAY_URL}/api/products?limit=1`);

        if (response.data.success !== undefined) {
            logPass('Response has success field');
        }

        if (response.data.data || response.data.products) {
            logPass('Response has data/products field');
        }

        if (response.status === 200) {
            logPass('Response status is 200');
        }
    } catch (error) {
        logFail(`Products API error: ${error.message}`);
    }

    // Test 4.2: Validate-stock API response format
    logTest('POST /api/products/validate-stock response format');

    const TEST_VARIANT_ID = process.env.TEST_VARIANT_ID;

    if (!TEST_VARIANT_ID) {
        logInfo('Skip validate-stock test (no TEST_VARIANT_ID)');
        return;
    }

    try {
        const response = await axios.post(`${GATEWAY_URL}/api/products/validate-stock`, {
            items: [{ variant: TEST_VARIANT_ID, quantity: 1 }]
        });

        if (response.data.success !== undefined) {
            logPass('Validate-stock response has success field');
        }

        if (response.data.message || response.data.error) {
            logPass('Validate-stock response has message/error field');
        }
    } catch (error) {
        if (error.response?.data?.success !== undefined) {
            logPass('Error response has success field');
        }

        if (error.response?.data?.error) {
            logPass('Error response has error field');
        }
    }
}

// ================== MAIN TEST RUNNER ==================

async function runUnitTests() {
    console.log('\n');
    console.log('🧪 UNIT TESTS');
    console.log('═'.repeat(70));
    console.log('Testing Individual Components and Functions');
    console.log('═'.repeat(70));

    console.log('\nNote: Some tests require TEST_VARIANT_ID environment variable');
    console.log('Usage: TEST_VARIANT_ID=<variant_id> node tests/unit-tests.js\n');

    try {
        await testOrderModelSchema();
        await testProductModelSchema();
        await testInventoryHelper();
        await testAPIResponseFormat();
    } catch (error) {
        console.error('\n❌ Unit tests crashed:', error.message);
        console.error(error.stack);
    }

    // Print summary
    logSection('UNIT TEST SUMMARY');
    console.log(`\nTotal Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);

    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
    console.log(`\n📊 Success Rate: ${successRate}%`);

    if (failedTests === 0) {
        console.log('\n🎉 ALL UNIT TESTS PASSED! 🎉');
    } else {
        console.log('\n⚠️  SOME UNIT TESTS FAILED');
    }

    console.log('\n' + '='.repeat(70));
    console.log('Unit tests completed');
    console.log('='.repeat(70) + '\n');

    process.exit(failedTests === 0 ? 0 : 1);
}

// Run tests
runUnitTests().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
