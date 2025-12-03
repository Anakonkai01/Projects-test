# 🧪 Test Suite Documentation

Comprehensive test suite cho Microshop E-commerce Microservices sau khi fix các vấn đề trong Rescue Plan.

## 📋 Test Files

### 1. `setup-test-data.js`
Script để tạo test data trước khi chạy tests.

**Chức năng:**
- Verify tất cả services đang chạy
- Tạo test user và lấy JWT token
- Tạo test product với 3 variants (stock: 10, 5, 20)
- Tạo test discount code (optional)
- Save test config vào file

**Usage:**
```bash
# Cần admin token
TEST_ADMIN_TOKEN=<your_admin_jwt_token> node tests/setup-test-data.js

# Output: test-config.json và test-env.sh
```

### 2. `unit-tests.js`
Unit tests cho individual components và functions.

**Test Coverage:**
- Order Model Schema validation
- Product Model Schema validation
- inventoryHelper functions
- API response format validation

**Usage:**
```bash
# Chạy sau khi setup test data
source tests/test-env.sh
node tests/unit-tests.js
```

### 3. `comprehensive-test-suite.js`
End-to-end integration tests cho tất cả các chức năng đã fix.

**Test Suites:**
1. **Race Condition Prevention** - Test concurrent orders
2. **Rollback Mechanism** - Test inventory rollback khi order fails
3. **Idempotency** - Test duplicate request handling
4. **Order Creation Flow** - Test guest, authenticated, và points redemption
5. **Inventory APIs** - Test validate-stock và rollback-stock endpoints
6. **Order Cancellation** - Test stock restoration khi cancel
7. **Error Handling** - Test các edge cases

**Usage:**
```bash
source tests/test-env.sh
node tests/comprehensive-test-suite.js
```

### 4. `race-condition-test.js`
Specialized test cho race condition với configurable concurrent orders.

**Usage:**
```bash
source tests/test-env.sh
node tests/race-condition-test.js
```

## 🚀 Quick Start

### Bước 1: Start Services

```bash
cd /home/anakonkai/Work/Projects-test/Microshop
docker-compose up -d

# Verify services
docker-compose ps
```

### Bước 2: Setup Test Data

```bash
# Get admin token từ database hoặc login
# Hoặc create new admin user

# Run setup
TEST_ADMIN_TOKEN=<your_token> node tests/setup-test-data.js
```

### Bước 3: Load Test Environment

```bash
# Load environment variables
source tests/test-env.sh
```

### Bước 4: Run Tests

```bash
# Run từng test
node tests/unit-tests.js
node tests/comprehensive-test-suite.js
node tests/race-condition-test.js
```

## 📊 Test Coverage

### ✅ Fixed Issues Coverage

| Issue | Test Coverage | Test Files |
|-------|---------------|------------|
| Race Condition | ✅ | race-condition-test.js, comprehensive-test-suite.js |
| Missing Schema Fields | ✅ | unit-tests.js, comprehensive-test-suite.js |
| Rollback Mechanism | ✅ | comprehensive-test-suite.js |
| Idempotency | ✅ | comprehensive-test-suite.js |
| Redis Error Handling | ⚠️ Manual | (Requires stopping Redis) |
| Duplicate API Path | ✅ | (Implicit in all API tests) |

### Test Scenarios

#### Race Condition Tests:
- ✅ 10 concurrent orders với stock = 10
- ✅ Verify không có overselling
- ✅ Verify orders bị reject khi hết stock
- ✅ Check MongoDB transaction atomicity

#### Rollback Tests:
- ✅ Rollback khi discount invalid
- ✅ Rollback khi user creation fails
- ✅ Rollback khi points deduction fails
- ✅ Rollback khi order creation fails

#### Order Creation Tests:
- ✅ Guest order creation
- ✅ Authenticated order creation
- ✅ Order với loyalty points redemption
- ✅ Order với discount code
- ✅ Order cancellation & stock restoration

#### Error Handling Tests:
- ✅ Empty cart rejection
- ✅ Invalid variant ID rejection
- ✅ Missing shipping info rejection
- ✅ Insufficient stock rejection

#### Schema Tests:
- ✅ Order schema có redeemedPoints field
- ✅ Order schema có pointsDiscountPrice field
- ✅ Product variants có stock/sold fields
- ✅ All required fields exist

## 🔧 Configuration

### Environment Variables

```bash
# Required
GATEWAY_URL=http://localhost:8000
TEST_VARIANT_ID=<variant_id_from_setup>

# Optional (for authenticated tests)
TEST_USER_TOKEN=<jwt_token>
TEST_ADMIN_TOKEN=<jwt_token>
TEST_DISCOUNT_CODE=<discount_code>
TEST_PRODUCT_ID=<product_id>
```

## 📈 Success Criteria

### Passing Tests

Tất cả tests phải PASS để verify fixes hoạt động đúng:

- ✅ **0 overselling** trong race condition test
- ✅ **100% rollback success** khi order fails
- ✅ **Idempotency working** - duplicate requests return same order
- ✅ **Schema fields present** - redeemedPoints, pointsDiscountPrice
- ✅ **API endpoints** - validate-stock, rollback-stock working

### Expected Output

```
🧪 COMPREHENSIVE TEST SUITE
══════════════════════════════════════════════════════════════════
Testing Rescue Plan Fixes for Microshop E-commerce
══════════════════════════════════════════════════════════════════

...

══════════════════════════════════════════════════════════════════
  TEST SUMMARY
══════════════════════════════════════════════════════════════════

Total Tests: 25
✅ Passed: 25
❌ Failed: 0
⏱️  Total Time: 12.34s

📊 Success Rate: 100.0%

🎉 ALL TESTS PASSED! 🎉
✅ Rescue Plan fixes are working correctly!
```

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: "Cannot connect to gateway"

**Solution:**
```bash
# Check services
docker-compose ps

# Restart gateway
docker-compose restart gateway

# Check gateway logs
docker-compose logs gateway
```

#### Issue 2: "TEST_VARIANT_ID is required"

**Solution:**
```bash
# Run setup script first
TEST_ADMIN_TOKEN=<token> node tests/setup-test-data.js

# Then load environment
source tests/test-env.sh
```

#### Issue 3: "Insufficient stock" errors

**Solution:**
```bash
# Reset test product stock manually in MongoDB
docker exec -it microshop-mongo-1 mongo

> use products_db
> db.products.updateOne(
    { "variants._id": ObjectId("<variant_id>") },
    { $set: { "variants.$.stock": 10 } }
)
```

#### Issue 4: Tests fail với authentication errors

**Solution:**
```bash
# Token có thể expire, tạo new user
TEST_ADMIN_TOKEN=<token> node tests/setup-test-data.js

# Load new environment
source tests/test-env.sh
```

---

**Last Updated:** 2025-12-03
**Version:** 1.0.0
**Maintainer:** Claude Code
