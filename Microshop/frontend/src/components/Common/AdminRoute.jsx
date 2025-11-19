import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';

const AdminRoute = () => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user && user.role === 'ADMIN') {
        return <Outlet />; // Cho phép truy cập
    } else {
        // Chỉ hiển thị thông báo lỗi khi user tồn tại nhưng không phải admin
        // Không hiển thị khi user = null (đã logout)
        if (user && user.role !== 'ADMIN') {
            toast.error("Truy cập bị từ chối. Bạn không phải là Admin.");
        }
        return <Navigate to="/" replace />; // Chuyển hướng về trang chủ
    }
};

export default AdminRoute;