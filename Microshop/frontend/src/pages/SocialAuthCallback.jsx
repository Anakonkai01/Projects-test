// SocialAuthCallback.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice'; // Import action login

const SocialAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Tạo một user object giả để lưu vào localStorage
            const user = { token }; 
            localStorage.setItem('user', JSON.stringify(user));
            // Dispatch action login để cập nhật state trong Redux
            // Giả sử action login của bạn có thể nhận user object
            dispatch(login.fulfilled(user)); 
            navigate('/'); // Chuyển về trang chủ
        } else {
            // Xử lý lỗi
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default SocialAuthCallback;