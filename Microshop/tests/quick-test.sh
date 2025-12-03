#!/bin/bash
# =============================================================================
# MICROSHOP - QUICK API TEST
# =============================================================================
# Script kiểm tra nhanh các API endpoints
# =============================================================================

BASE_URL="http://localhost:8000/api"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 MICROSHOP - Quick API Test"
echo "=============================="
echo ""

# Test Products
echo -n "Products API:     "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/products")
[ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Auth
echo -n "Auth API:         "
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{}')
[ "$status" != "000" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Users (requires auth)
echo -n "Users API:        "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Orders (requires auth)
echo -n "Orders API:       "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/orders")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Discounts (requires auth)
echo -n "Discounts API:    "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/discounts")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Users Stats
echo -n "Users Stats:      "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users-stats/summary")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Orders Stats
echo -n "Orders Stats:     "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/orders-stats/summary")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Products Stats
echo -n "Products Stats:   "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/products-stats/summary")
[ "$status" == "401" ] || [ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

# Test Brands
echo -n "Brands API:       "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/products/brands/all")
[ "$status" == "200" ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL ($status)${NC}"

echo ""
echo "=============================="
echo "Quick test complete!"
