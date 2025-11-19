# Fix: Không thể tải danh sách thương hiệu trong bộ lọc

## Vấn đề
- Khi vào trang cửa hàng, hệ thống báo lỗi "Không thể tải danh sách thương hiệu"
- Bộ lọc (FilterSidebar) không hiển thị danh sách các hãng
- API `/api/products/brands/all` trả về 404

## Nguyên nhân
Gateway đang sử dụng `pathRewrite` không đúng cách với Express middleware. Khi dùng `app.use('/api/products', ...)`, Express tự động loại bỏ prefix `/api/products` trước khi gửi request vào proxy middleware, dẫn đến `pathRewrite` không tìm thấy pattern để thay thế.

### Luồng request sai (trước khi sửa):
1. Frontend gọi: `GET /api/products/brands/all`
2. Gateway nhận: `/api/products/brands/all`
3. Express xử lý `app.use('/api/products')` và strip prefix → còn `/brands/all`
4. `pathRewrite: {'^/api/products': '/products_ser'}` không tìm thấy pattern (vì path chỉ còn `/brands/all`)
5. Request được gửi đến Products service: `GET /brands/all` ❌
6. Products service trả về 404 (route đúng phải là `/products_ser/brands/all`)

## Giải pháp

### 1. Sửa Gateway Proxy Configuration
**File**: `microshop-microservices/gateway/server.js`

**Trước:**
```javascript
app.use('/api/products', createProxyMiddleware({ 
    target: PRODUCTS_TARGET,  // http://products:8002
    changeOrigin: true, 
    pathRewrite: { '^/api/products': '/products_ser' },
}));
```

**Sau:**
```javascript
app.use('/api/products', createProxyMiddleware({ 
    target: `${PRODUCTS_TARGET}/products_ser`,  // http://products:8002/products_ser
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Products Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
    }
}));
```

### 2. Sửa Frontend API Services

#### File: `frontend/src/features/products/productService.js`
**Trước:**
```javascript
const API_URL = '/products/products_ser/';
```

**Sau:**
```javascript
const API_URL = '/products';
```

#### File: `frontend/src/features/admin/adminProductService.js`
**Trước:**
```javascript
const API_URL = '/products/products_ser'; 
const categories = '/products/categories';
```

**Sau:**
```javascript
const API_URL = '/products'; 
const categories = '/categories';
```

#### File: `frontend/src/features/products/reviewService.js`
**Trước:**
```javascript
const API_URL = '/products/products_ser/';
```

**Sau:**
```javascript
const API_URL = '/products';
```

## Luồng request đúng (sau khi sửa)

1. Frontend gọi: `GET /api/products/brands/all`
2. Gateway nhận: `/api/products/brands/all`
3. Express xử lý `app.use('/api/products')` và strip prefix → còn `/brands/all`
4. Target đã bao gồm `/products_ser` → Request gửi đến: `http://products:8002/products_ser/brands/all` ✅
5. Products service nhận: `GET /products_ser/brands/all` ✅
6. Trả về: `{"success":true,"data":["Apple","Asus","Dell","Google","HP","Samsung"],"count":6}` ✅

## Cách áp dụng fix

1. **Rebuild gateway container:**
   ```bash
   cd /home/hpenvy/projects/Microshop
   docker compose up -d --build gateway
   ```

2. **Restart frontend container:**
   ```bash
   docker compose restart frontend
   ```

3. **Test API:**
   ```bash
   curl http://localhost:8000/api/products/brands/all
   ```

   Kết quả mong đợi:
   ```json
   {
     "success": true,
     "data": ["Apple", "Asus", "Dell", "Google", "HP", "Samsung"],
     "count": 6
   }
   ```

## Kết quả
✅ API `/api/products/brands/all` hoạt động bình thường
✅ Bộ lọc trong trang cửa hàng hiển thị đầy đủ danh sách hãng
✅ Người dùng có thể lọc sản phẩm theo thương hiệu

## Bài học
- Khi sử dụng `app.use('/path', middleware)` trong Express, path sẽ được tự động stripped trước khi vào middleware
- Với http-proxy-middleware, nên thêm path cần thiết vào `target` thay vì dùng `pathRewrite` khi làm việc với Express routing
- Luôn kiểm tra logs để debug proxy issues (thêm `onProxyReq` callback)

## Files đã thay đổi
- `microshop-microservices/gateway/server.js`
- `frontend/src/features/products/productService.js`
- `frontend/src/features/admin/adminProductService.js`
- `frontend/src/features/products/reviewService.js`

---
**Ngày sửa**: 20/11/2025
**Người sửa**: GitHub Copilot
