#!/bin/bash
# Script kiểm tra các API Admin

BASE_URL="http://localhost:8000/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 KIỂM TRA ADMIN APIs - Microshop"
echo "=================================="

# Test 1: Products API
echo ""
echo "1️⃣  Testing Products API..."
PRODUCTS_RESPONSE=$(curl -s "${BASE_URL}/products?page=1&limit=3")
if echo "$PRODUCTS_RESPONSE" | grep -q '"success":true'; then
    COUNT=$(echo "$PRODUCTS_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(len(d.get('data', [])))" 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ GET /api/products - SUCCESS (Found $COUNT products)${NC}"
else
    echo -e "${RED}❌ GET /api/products - FAILED${NC}"
fi

# Test 2: Single Product
echo ""
echo "2️⃣  Testing Single Product API..."
PRODUCT_ID=$(echo "$PRODUCTS_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d['data'][0]['_id'])" 2>/dev/null || echo "")
if [ ! -z "$PRODUCT_ID" ]; then
    SINGLE_PRODUCT=$(curl -s "${BASE_URL}/products/${PRODUCT_ID}")
    if echo "$SINGLE_PRODUCT" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ GET /api/products/:id - SUCCESS${NC}"
    else
        echo -e "${RED}❌ GET /api/products/:id - FAILED${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipped (No product ID)${NC}"
fi

# Test 3: Orders API
echo ""
echo "3️⃣  Testing Orders API..."
ORDERS_RESPONSE=$(curl -s "${BASE_URL}/orders")
if echo "$ORDERS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ GET /api/orders - SUCCESS${NC}"
else
    echo -e "${RED}❌ GET /api/orders - FAILED${NC}"
fi

# Test 4: Users API  
echo ""
echo "4️⃣  Testing Users API..."
USERS_RESPONSE=$(curl -s "${BASE_URL}/users")
if echo "$USERS_RESPONSE" | grep -q '"success":true' || echo "$USERS_RESPONSE" | grep -q '"data"'; then
    echo -e "${GREEN}✅ GET /api/users - SUCCESS${NC}"
else
    echo -e "${YELLOW}⚠️  GET /api/users - May require authentication${NC}"
fi

# Test 5: Discounts API
echo ""
echo "5️⃣  Testing Discounts API..."
DISCOUNTS_RESPONSE=$(curl -s "${BASE_URL}/discounts")
if echo "$DISCOUNTS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ GET /api/discounts - SUCCESS${NC}"
else
    echo -e "${YELLOW}⚠️  GET /api/discounts - May require authentication${NC}"
fi

# Test 6: Categories (Should be removed)
echo ""
echo "6️⃣  Testing Categories API (should be removed)..."
CATEGORIES_RESPONSE=$(curl -s -w "%{http_code}" "${BASE_URL}/categories" -o /dev/null)
if [ "$CATEGORIES_RESPONSE" == "404" ]; then
    echo -e "${GREEN}✅ GET /api/categories - Correctly returns 404 (removed)${NC}"
else
    echo -e "${RED}❌ GET /api/categories - Should be removed! (Status: $CATEGORIES_RESPONSE)${NC}"
fi

echo ""
echo "=================================="
echo "✨ Admin API Tests Complete!"
