// E_com/FE/src/pages/OrderDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Chú ý: Chúng ta sẽ tái sử dụng service và slice của admin để lấy chi tiết đơn hàng bằng ID
import { getAdminOrderById, reset } from '../features/admin/adminOrderSlice';
import { toast } from 'sonner';

const OrderDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // Lấy state từ adminOrders slice
    const { order, isLoading, isError, message } = useSelector(state => state.adminOrders);

    useEffect(() => {
        if (isError) toast.error(message);
        dispatch(getAdminOrderById(id));
        return () => dispatch(reset());
    }, [dispatch, id, isError, message]);
    
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

    if (isLoading || !order) {
        return <p className="p-10 text-center">Đang tải chi tiết đơn hàng...</p>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Link to="/profile" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Quay lại trang cá nhân</Link>
            <h1 className="text-3xl font-bold mb-6">Chi Tiết Đơn Hàng #{order._id}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Danh sách sản phẩm */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-xl">Sản phẩm</h3>
                        {order.orderItems.map(item => (
                            <div key={item._id} className="flex items-start gap-4 border-b py-4 last:border-b-0">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                     {/* Lịch sử trạng thái */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-xl">Lịch sử trạng thái</h3>
                        <div className="space-y-4">
                            {[...order.orderStatusHistory].reverse().map((history, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-4"></div>
                                    <div>
                                        <p className="font-semibold">{history.status}</p>
                                        <p className="text-sm text-gray-500">{formatDate(history.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Tóm tắt */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-xl">Tóm tắt</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">Tiền hàng:</span> <span>{formatPrice(order.itemsPrice)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Phí vận chuyển:</span> <span>{formatPrice(order.shippingPrice)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Thuế:</span> <span>{formatPrice(order.taxPrice)}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span >Tổng cộng:</span> <span className="text-red-600">{formatPrice(order.totalPrice)}</span></div>
                        </div>
                    </div>
                    {/* Địa chỉ giao hàng */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-xl">Địa chỉ giao hàng</h3>
                        <p className="font-bold">{order.user?.name}</p>
                        <p>{order.shippingInfo.phoneNo}</p>
                        <p>{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.country}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;