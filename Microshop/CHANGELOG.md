# Changelog - Microshop Project Updates

## Ngày cập nhật: 20/11/2025

### 🔧 Sửa lỗi API Brands Dropdown

#### Vấn đề
- Dropdown thương hiệu (brands) trong trang Cửa hàng không thể tải danh sách
- Hiển thị thông báo lỗi: "Không thể tải danh sách thương hiệu"

#### Nguyên nhân
- **Lỗi đường dẫn API**: FilterSidebar đang gọi `/api/products/brands/all`
- **Cấu hình axios**: `VITE_BACKEND_URL` đã bao gồm `/api` trong baseURL
- **Kết quả**: URL cuối cùng trở thành `http://localhost:8000/api/api/products/brands/all` (duplicate `/api`)

#### Giải pháp
**File: `/frontend/src/components/Products/FilterSidebar.jsx`**
- Thay đổi đường dẫn API từ `/api/products/brands/all` → `/products/brands/all`
- Lý do: axios instance đã có baseURL = `http://localhost:8000/api`, chỉ cần thêm path tương đối

```javascript
// BEFORE:
const response = await axios.get('/api/products/brands/all');

// AFTER:
const response = await axios.get('/products/brands/all');
```

#### Kiến trúc API hiện tại

**Frontend → Gateway → Products Service:**
```
Frontend axios call:        /products/brands/all
↓
Axios baseURL adds:         http://localhost:8000/api
↓
Full URL:                   http://localhost:8000/api/products/brands/all
↓
Gateway proxy:              /api/products → /products_ser (pathRewrite)
↓
Products Service:           /products_ser/brands/all
↓
Controller:                 getAllBrands()
```

#### Chi tiết cấu hình

**1. Frontend - axios config**
- File: `/frontend/src/utils/axios.js`
- BaseURL: `import.meta.env.VITE_BACKEND_URL` = `http://localhost:8000/api`

**2. Gateway - routing**
- File: `/microshop-microservices/gateway/server.js`
- Port: 8000
- Proxy rule: `/api/products` → `http://products-service/products_ser`

**3. Products Service - routes**
- File: `/microshop-microservices/services/products/server.js`
- Mount point: `/products_ser`
- Route: `router.get('/brands/all', getAllBrands)`
- Controller: `/controllers/productController.js` - `exports.getAllBrands`

#### Lưu ý quan trọng
⚠️ **Backend services phải đang chạy để API hoạt động:**
- Gateway Service (port 8000)
- Products Service (port 8002)
- Khởi động bằng: `docker compose up` hoặc `npm start` trong từng service

#### Files đã chỉnh sửa
1. ✅ `/frontend/src/components/Products/FilterSidebar.jsx` - Sửa đường dẫn API brands

---

## Các tính năng đã hoàn thành trước đó

### ✨ Cải tiến Filter Sidebar
- Thêm dropdown cho Brand, RAM, Storage
- Thêm khoảng giá được định sẵn (Dưới 5 triệu, 5-10 triệu, etc.)
- Thêm filter theo đánh giá sao
- Loại bỏ category filter (chỉ bán điện thoại)

### ✨ Cải tiến Product Card
- Thêm hiển thị rating (StarRating component)
- Thêm nút "Thêm vào giỏ" và "Mua ngay"
- Fix cấu trúc object khi gọi addToCart action

### ✨ Trang Contact
- Thay thế form giả bằng thông tin liên hệ thực
- Thêm địa chỉ, số điện thoại, email, giờ làm việc
- Thêm phần FAQ accordion

### ✨ Thống nhất branding
- Đổi tên từ "MobileShope" → "Microshop"
- Xác nhận chỉ bán điện thoại (không bán laptop)

### ✨ Hệ thống đánh giá
- Cho phép unlimited reviews từ một user
- User có thể review nhiều lần cho cùng một sản phẩm

### ✨ Các sửa lỗi khác
- Logout notification
- Cart badge counter
- Price filter logic
- Order details display
- Address manager
- Password change validation
- Register/Login form validation

---

## Hướng dẫn triển khai

### Khởi động Backend (Microservices)
```bash
cd microshop-microservices
docker compose up -d
# hoặc
npm start
```

### Khởi động Frontend
```bash
cd frontend
npm run dev
```

### Kiểm tra services
```bash
# Check Docker containers
docker compose ps

# Check ports
lsof -i :8000  # Gateway
lsof -i :8002  # Products Service
lsof -i :8001  # Users Service
lsof -i :8003  # Orders Service
```

### Environment Variables
**Frontend `.env`:**
```
VITE_BACKEND_URL=http://localhost:8000/api
```

**Backend `.env`:**
```
GATEWAY_PORT=8000
PRODUCTS_PORT=8002
USERS_PORT=8001
ORDERS_PORT=8003
```

---

## Ghi chú kỹ thuật

### Quy tắc đường dẫn API
- ✅ Đúng: `axios.get('/products/brands/all')` - axios tự động thêm baseURL
- ❌ Sai: `axios.get('/api/products/brands/all')` - duplicate `/api`

### Gateway Proxy Rules
```javascript
'/api/products' → PRODUCTS_TARGET + '/products_ser'
'/api/auth' → USERS_TARGET + '/auth'
'/api/users' → USERS_TARGET + '/users'
'/api/orders' → ORDERS_TARGET + '/orders'
'/api/categories' → PRODUCTS_TARGET + '/categories'
```

### Debug Tips
```javascript
// Add logging in FilterSidebar
console.log('🔵 Request URL:', axios.defaults.baseURL + '/products/brands/all');
console.log('✅ Response:', response.data);
console.error('❌ Error:', error.response?.data);
```
