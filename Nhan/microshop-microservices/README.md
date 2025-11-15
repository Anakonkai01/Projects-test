# Microshop — Node.js Microservices (Users, Products, Orders)

A minimal, production-leaning microservice system using **Node.js + Express + MongoDB (Mongoose)** with an **API Gateway**.
- Each service owns its database
- JWT auth (issued by Users, validated elsewhere)
- Synchronous stock reservation (simple version)
- Docker Compose for one-command spin‑up

```
Client → API Gateway (8000)
          ├─ /api/users    → Users Service (8001)   → MongoDB: usersdb
          ├─ /api/products → Products Service (8002) → MongoDB: productsdb
          └─ /api/orders   → Orders Service (8003)  → MongoDB: ordersdb
```

## Quickstart (with Docker)

```bash
cp .env.example .env
docker compose up --build
# Gateway:  http://localhost:8000/health
# Users:    http://localhost:8001/health
# Products: http://localhost:8002/health
# Orders:   http://localhost:8003/health
```

## Quickstart (without Docker)

1) Ensure local MongoDB running at `mongodb://localhost:27017`  
2) Open 4 terminals and run:

```bash
# users
npm --workspace services/users install
npm --workspace services/users start

# products
npm --workspace services/products install
npm --workspace services/products start

# orders
npm --workspace services/orders install
npm --workspace services/orders start

# gateway
npm --workspace gateway install
npm --workspace gateway start
```

## Smoke Test

```bash
# Register and login as ADMIN
curl -X POST http://localhost:8000/api/users/register   -H 'Content-Type: application/json'   -d '{"name":"Admin","email":"admin@test.com","password":"pass","role":"ADMIN"}'

TOKEN=$(curl -s -X POST http://localhost:8000/api/users/login   -H 'Content-Type: application/json'   -d '{"email":"admin@test.com","password":"pass"}' | jq -r .token)

# Create a product
curl -X POST http://localhost:8000/api/products   -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json'   -d '{"title":"Keyboard","price":49.9,"stock":10}'

# Register normal user
curl -X POST http://localhost:8000/api/users/register   -H 'Content-Type: application/json'   -d '{"name":"Alice","email":"alice@test.com","password":"pass"}'

ALICE=$(curl -s -X POST http://localhost:8000/api/users/login   -H 'Content-Type: application/json'   -d '{"email":"alice@test.com","password":"pass"}' | jq -r .token)

# Place an order
PID=$(curl -s http://localhost:8000/api/products | jq -r '.[0]._id')
curl -X POST http://localhost:8000/api/orders   -H "Authorization: Bearer $ALICE" -H 'Content-Type: application/json'   -d "{"items":[{"productId":"$PID","qty":2}]}"
```

## Environment

Copy `.env.example` to `.env` and adjust as needed.

## Notes & Next Steps

- The reserve flow is simplified and not transactional across services.
- For production, prefer Mongo replica set transactions or a Saga (event-driven) workflow.
- Add rate limiting, request IDs, and observability later.
