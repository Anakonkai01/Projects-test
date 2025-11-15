#!/usr/bin/env bash
set -euo pipefail

TOKEN=$(curl -s -X POST http://localhost:8000/api/users/login   -H 'Content-Type: application/json'   -d '{"email":"admin@test.com","password":"pass"}' | jq -r .token)

curl -X POST http://localhost:8000/api/products   -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json'   -d '{"title":"Keyboard","price":49.9,"stock":10}'

PID=$(curl -s http://localhost:8000/api/products | jq -r '.[0]._id')

ALICE=$(curl -s -X POST http://localhost:8000/api/users/login   -H 'Content-Type: application/json'   -d '{"email":"alice@test.com","password":"pass"}' | jq -r .token)

curl -X POST http://localhost:8000/api/orders   -H "Authorization: Bearer $ALICE" -H 'Content-Type: application/json'   -d "{"items":[{"productId":"$PID","qty":2}]}"
