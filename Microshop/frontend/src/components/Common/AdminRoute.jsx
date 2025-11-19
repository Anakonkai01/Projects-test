import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';

const AdminRoute = () => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'ADMIN') {
        return <Outlet />;
    } else {
        toast.error("Truy cập bị từ chối. Bạn không phải là Admin.");
        return <Navigate to="/" replace />;
    }
};

export default AdminRoute;