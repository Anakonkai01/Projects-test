#!/bin/bash
# Test script để tạo sản phẩm với ADMIN token

BASE_URL="http://localhost:8000/api"

echo "🔐 Step 1: Login as ADMIN..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/users/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "phamminhhaohungnhuong@gmail.com",
    "password": "Pham123hao"
  }')

echo "Login response: $LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token. Trying admin@microshop.com..."
    
    LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/users/auth/login" \
      -H 'Content-Type: application/json' \
      -d '{
        "email": "admin@microshop.com",
        "password": "admin123"
      }')
    
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('token', ''))" 2>/dev/null || echo "")
fi

if [ -z "$TOKEN" ]; then
    echo "❌ Could not login. Please check credentials."
    exit 1
fi

echo "✅ Got token: ${TOKEN:0:50}..."

echo ""
echo "🖼️  Step 2: Test with simple product data (no images)..."

# Create test images (1x1 pixel PNG)
echo "Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test1.png
cp /tmp/test1.png /tmp/test2.png
cp /tmp/test1.png /tmp/test3.png

echo ""
echo "📦 Step 3: Create product..."

RESPONSE=$(curl -s -X POST "${BASE_URL}/products" \
  -H "Authorization: Bearer $TOKEN" \
  -F 'name=Test Product' \
  -F 'description=Test Description' \
  -F 'price=1000000' \
  -F 'brand=TestBrand' \
  -F 'variants=[{"name":"Test Variant","sku":"TEST-001","stock":10,"price":1000000,"imageIndex":0}]' \
  -F 'specifications={"display":"Test","processor":"Test","ram":"8GB","storage":"256GB"}' \
  -F 'images=@/tmp/test1.png' \
  -F 'images=@/tmp/test2.png' \
  -F 'images=@/tmp/test3.png')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Product created successfully!"
else
    echo "❌ Failed to create product"
    echo "Full response: $RESPONSE"
fi

# Cleanup
rm -f /tmp/test*.png

echo ""
echo "🎉 Test complete!"
