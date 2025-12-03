/**
 * SETUP TEST DATA
 * Script để tạo test data trước khi chạy tests
 *
 * Usage: node tests/setup-test-data.js
 * Requires: TEST_ADMIN_TOKEN environment variable
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8000';
const ADMIN_TOKEN = process.env.TEST_ADMIN_TOKEN;

// ================== HELPER FUNCTIONS ==================

function log(message) {
    console.log(`[SETUP] ${message}`);
}

function logSuccess(message) {
    console.log(`✅ ${message}`);
}

function logError(message) {
    console.error(`❌ ${message}`);
}

function saveTestConfig(config) {
    const configPath = path.join(__dirname, 'test-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    log(`Test config saved to ${configPath}`);
}

// ================== SETUP FUNCTIONS ==================

async function createTestProduct() {
    log('Creating test product with variants...');

    if (!ADMIN_TOKEN) {
        logError('TEST_ADMIN_TOKEN is required to create products');
        log('Please provide admin JWT token:');
        log('  TEST_ADMIN_TOKEN=<jwt_token> node tests/setup-test-data.js');
        process.exit(1);
    }

    const productData = {
        name: 'Test Product for Race Condition',
        description: 'This is a test product with limited stock for testing race conditions',
        price: 100000,
        brand: 'Test Brand',
        specifications: {
            display: 'Test Display',
            processor: 'Test Processor',
            ram: '8GB',
            storage: '256GB'
        },
        variants: [
            {
                name: 'Test Variant 1 (Stock: 10)',
                sku: 'TEST-VAR-001',
                stock: 10,
                price: 100000,
                imageIndex: 0
            },
            {
                name: 'Test Variant 2 (Stock: 5)',
                sku: 'TEST-VAR-002',
                stock: 5,
                price: 120000,
                imageIndex: 0
            },
            {
                name: 'Test Variant 3 (Stock: 20)',
                sku: 'TEST-VAR-003',
                stock: 20,
                price: 150000,
                imageIndex: 0
            }
        ],
        images: [
            {
                public_id: 'test_product_1',
                url: 'https://via.placeholder.com/500x500.png?text=Test+Product'
            }
        ]
    };

    try {
        // Create product without images first
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('brand', productData.brand);
        formData.append('variants', JSON.stringify(productData.variants));
        formData.append('specifications', JSON.stringify(productData.specifications));

        const response = await axios.post(
            `${GATEWAY_URL}/api/products`,
            productData,
            {
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const product = response.data.data;
        logSuccess(`Product created: ${product._id}`);
        log(`  Name: ${product.name}`);
        log(`  Variants: ${product.variants.length}`);

        // Extract variant IDs
        const variantIds = product.variants.map((v, i) => ({
            id: v._id,
            name: v.name,
            stock: v.stock,
            sku: v.sku
        }));

        logSuccess('Test product variants:');
        variantIds.forEach((v, i) => {
            log(`  ${i + 1}. ${v.name}`);
            log(`     ID: ${v.id}`);
            log(`     Stock: ${v.stock}`);
        });

        return {
            productId: product._id,
            variants: variantIds
        };

    } catch (error) {
        logError(`Failed to create test product: ${error.response?.data?.error || error.message}`);
        if (error.response?.data) {
            console.error(error.response.data);
        }
        throw error;
    }
}

async function createTestUser() {
    log('Creating test user...');

    const testUser = {
        name: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
        password: 'Test123456',
        role: 'USER'
    };

    try {
        // Register user
        const response = await axios.post(
            `${GATEWAY_URL}/api/auth/register`,
            testUser
        );

        logSuccess(`Test user created: ${response.data.user.email}`);
        logSuccess(`User ID: ${response.data.user._id}`);

        // Get token
        const token = response.data.token;
        log(`JWT Token (first 20 chars): ${token.substring(0, 20)}...`);

        return {
            userId: response.data.user._id,
            email: testUser.email,
            password: testUser.password,
            token: token
        };

    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.includes('đã tồn tại')) {
            log('Test user already exists, trying to login...');

            try {
                const loginResponse = await axios.post(
                    `${GATEWAY_URL}/api/auth/login`,
                    {
                        email: testUser.email,
                        password: testUser.password
                    }
                );

                logSuccess(`Logged in as existing test user`);

                return {
                    userId: loginResponse.data.user._id,
                    email: testUser.email,
                    token: loginResponse.data.token
                };
            } catch (loginError) {
                logError(`Cannot login test user: ${loginError.message}`);
                throw loginError;
            }
        } else {
            logError(`Failed to create test user: ${error.response?.data?.error || error.message}`);
            throw error;
        }
    }
}

async function createTestDiscount() {
    log('Creating test discount code...');

    if (!ADMIN_TOKEN) {
        logError('TEST_ADMIN_TOKEN is required to create discounts');
        return null;
    }

    const discountData = {
        code: `TEST${Date.now()}`,
        discountType: 'percentage',
        value: 10,
        usageLimit: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    try {
        const response = await axios.post(
            `${GATEWAY_URL}/api/discounts`,
            discountData,
            {
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                }
            }
        );

        logSuccess(`Discount created: ${response.data.data.code}`);
        log(`  Type: ${response.data.data.discountType}`);
        log(`  Value: ${response.data.data.value}%`);

        return {
            code: response.data.data.code,
            discountId: response.data.data._id
        };

    } catch (error) {
        if (error.response?.status === 404) {
            log('Discount API not available (skip)');
            return null;
        }

        logError(`Failed to create discount: ${error.response?.data?.error || error.message}`);
        return null;
    }
}

async function verifyServices() {
    log('Verifying all services are running...');

    const services = [
        { name: 'Gateway', url: `${GATEWAY_URL}/api` },
        { name: 'Products', url: `${GATEWAY_URL}/api/products` },
        { name: 'Orders', url: `${GATEWAY_URL}/api/orders` },
        { name: 'Auth', url: `${GATEWAY_URL}/api/auth` }
    ];

    for (const service of services) {
        try {
            await axios.get(service.url, { timeout: 3000 });
            logSuccess(`${service.name} service: OK`);
        } catch (error) {
            if (error.response?.status) {
                logSuccess(`${service.name} service: OK (status ${error.response.status})`);
            } else {
                logError(`${service.name} service: UNREACHABLE`);
                throw new Error(`${service.name} service is not running`);
            }
        }
    }
}

// ================== MAIN SETUP ==================

async function setupTestData() {
    console.log('\n');
    console.log('🔧 TEST DATA SETUP');
    console.log('═'.repeat(70));
    console.log('Preparing test data for comprehensive test suite');
    console.log('═'.repeat(70));
    console.log('');

    try {
        // Step 1: Verify services
        await verifyServices();
        console.log('');

        // Step 2: Create test user
        const userData = await createTestUser();
        console.log('');

        // Step 3: Create test product
        const productData = await createTestProduct();
        console.log('');

        // Step 4: Create test discount (optional)
        const discountData = await createTestDiscount();
        console.log('');

        // Step 5: Save config
        const testConfig = {
            gatewayUrl: GATEWAY_URL,
            product: productData,
            user: {
                userId: userData.userId,
                email: userData.email,
                token: userData.token
            },
            discount: discountData,
            createdAt: new Date().toISOString()
        };

        saveTestConfig(testConfig);

        // Print summary
        console.log('');
        console.log('═'.repeat(70));
        console.log('✅ TEST DATA SETUP COMPLETED');
        console.log('═'.repeat(70));
        console.log('');
        console.log('📋 Environment Variables for Testing:');
        console.log('');
        console.log(`export GATEWAY_URL="${GATEWAY_URL}"`);
        console.log(`export TEST_VARIANT_ID="${productData.variants[0].id}"`);
        console.log(`export TEST_PRODUCT_ID="${productData.productId}"`);
        console.log(`export TEST_USER_TOKEN="${userData.token}"`);
        if (discountData) {
            console.log(`export TEST_DISCOUNT_CODE="${discountData.code}"`);
        }
        console.log('');
        console.log('💡 Quick Start:');
        console.log('');
        console.log('# Copy the export commands above, then run:');
        console.log('');
        console.log('# 1. Unit tests');
        console.log('node tests/unit-tests.js');
        console.log('');
        console.log('# 2. Comprehensive tests');
        console.log('node tests/comprehensive-test-suite.js');
        console.log('');
        console.log('# 3. Race condition test');
        console.log('node tests/race-condition-test.js');
        console.log('');
        console.log('═'.repeat(70));
        console.log('');

        // Save bash script for convenience
        const bashScript = `#!/bin/bash
# Auto-generated test environment variables
export GATEWAY_URL="${GATEWAY_URL}"
export TEST_VARIANT_ID="${productData.variants[0].id}"
export TEST_PRODUCT_ID="${productData.productId}"
export TEST_USER_TOKEN="${userData.token}"
${discountData ? `export TEST_DISCOUNT_CODE="${discountData.code}"` : ''}

echo "✅ Test environment variables loaded"
echo ""
echo "Run tests with:"
echo "  node tests/unit-tests.js"
echo "  node tests/comprehensive-test-suite.js"
echo "  node tests/race-condition-test.js"
`;

        const scriptPath = path.join(__dirname, 'test-env.sh');
        fs.writeFileSync(scriptPath, bashScript);
        fs.chmodSync(scriptPath, '755');

        logSuccess(`Test environment script saved: ${scriptPath}`);
        log('Run: source tests/test-env.sh');

    } catch (error) {
        console.error('');
        logError('Test data setup failed!');
        console.error(error.message);
        process.exit(1);
    }
}

// Run setup
setupTestData();
