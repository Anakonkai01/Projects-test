// E_com/FE/src/pages/OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderSuccess = () => {
    const { order } = useSelector((state) => state.order);

    if (!order) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Không tìm thấy thông tin đơn hàng</h1>
                <p className="mt-4">Có thể bạn đã truy cập trực tiếp vào trang này.</p>
                <Link to="/" className="text-blue-600 mt-4 inline-block">Quay về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-10 text-center flex flex-col items-center">
            <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-700 mb-2">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được ghi nhận.</p>
            <p className="text-gray-700 mb-6">Mã đơn hàng của bạn là: <span className="font-semibold text-gray-900">{order._id}</span></p>
            
            <Link to={`/order/${order._id}`} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Xem chi tiết đơn hàng
            </Link>
        </div>
    );
};

export default OrderSuccess;