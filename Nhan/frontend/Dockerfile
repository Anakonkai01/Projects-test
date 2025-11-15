# Giai đoạn 1: Build ứng dụng React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# VITE_BACKEND_URL sẽ được cung cấp lúc chạy container
RUN npm run build

# Giai đoạn 2: Serve ứng dụng đã build bằng Nginx
FROM nginx:stable-alpine
# Sao chép các file static đã được build từ giai đoạn trước
COPY --from=build /app/dist /usr/share/nginx/html
# Sao chép file cấu hình Nginx (tùy chọn, nếu cần)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]