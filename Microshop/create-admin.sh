#!/bin/bash

BASE_URL="http://localhost:8000/api"

echo "📝 Creating admin user..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/users/auth/register" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Admin User",
    "email": "admin@microshop.com",
    "password": "admin123"
  }')

echo "Register response: $REGISTER_RESPONSE"

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo "✅ User created. Now need to set role to ADMIN in MongoDB..."
    echo ""
    echo "Run this command in MongoDB to set ADMIN role:"
    echo ""
    echo "db.users.updateOne({email: 'admin@microshop.com'}, {\$set: {role: 'ADMIN'}})"
    echo ""
elif echo "$REGISTER_RESPONSE" | grep -q "Email đã tồn tại"; then
    echo "✅ User already exists"
else
    echo "❌ Failed to create user"
fi
