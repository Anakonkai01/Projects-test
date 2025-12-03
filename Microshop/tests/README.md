# Microshop Test Suite

Bộ test tự động cho hệ thống Microshop.

## Cách sử dụng

### 1. Quick Test (Kiểm tra nhanh)

Kiểm tra nhanh tất cả API endpoints có hoạt động không:

```bash
cd /home/acerswift/Projects-test/Microshop
chmod +x tests/quick-test.sh
./tests/quick-test.sh
```

### 2. Full Test Suite (Test đầy đủ)

Chạy bộ test hoàn chỉnh bao gồm:
- Health Check
- Authentication (Register, Login, Update)
- Address Management
- Cart Operations
- Products (CRUD, Filter, Search)
- Orders (Create, View, Cancel)
- Discounts
- Stats APIs
- Admin Functions
- Security Tests
- Error Handling Tests

```bash
cd /home/acerswift/Projects-test/Microshop
chmod +x tests/run-all-tests.sh
./tests/run-all-tests.sh
```

## Yêu cầu

- Docker services đang chạy (`docker compose up -d`)
- curl
- python3 (để parse JSON)

## Các API được test

| API | Endpoint | Auth |
|-----|----------|------|
| Auth | `/api/auth/*` | No |
| Users | `/api/users/*` | Admin |
| Products | `/api/products/*` | Public/Admin |
| Orders | `/api/orders/*` | User/Admin |
| Discounts | `/api/discounts/*` | User/Admin |
| Stats | `/api/*-stats/summary` | Admin |

## Environment Variables (Tùy chọn)

Có thể set các biến môi trường trước khi chạy test:

```bash
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="Admin123!"
./tests/run-all-tests.sh
```
