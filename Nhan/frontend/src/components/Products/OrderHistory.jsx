// E_com/FE/src/components/Profile/OrderHistory.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../../features/orders/orderSlice';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    if (isLoading) return <p>Đang tải lịch sử đơn hàng...</p>;
    if (isError) return <p className="text-red-500">Lỗi: {message}</p>;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Lịch sử Đơn hàng</h3>
            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold">Mã ĐH: {order._id}</p>
                                <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.createdAt)}</p>
                            </div>
                            <p>Tổng tiền: <span className="font-semibold text-red-600">{formatPrice(order.totalPrice)}</span></p>
                            <p>Trạng thái: <span className="font-semibold text-green-600">{order.orderStatusHistory.slice(-1)[0].status}</span></p>
                            <Link to={`/order/${order._id}`} className="text-blue-500 hover:underline mt-2 inline-block">Xem chi tiết</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;