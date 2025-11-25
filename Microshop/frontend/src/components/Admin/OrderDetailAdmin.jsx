// E_com/FE/src/components/Admin/OrderDetailAdmin.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getAdminOrderById, updateAdminOrderStatus, reset } from '../../features/admin/adminOrderSlice';

const OrderDetailAdmin = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, isLoading, isError, message } = useSelector(state => state.adminOrders);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (isError) toast.error(message);
        dispatch(getAdminOrderById(id));
        return () => dispatch(reset());
    }, [dispatch, id, isError, message]);

    useEffect(() => {
        if (order) {
            setStatus(order.orderStatusHistory.slice(-1)[0].status);
        }
    }, [order]);

    const handleUpdateStatus = () => {
        dispatch(updateAdminOrderStatus({ orderId: id, status }))
            .unwrap()
            .then(() => toast.success('Cập nhật trạng thái thành công!'))
            .catch((err) => toast.error('Cập nhật thất bại.'));
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (date) => new Date(date).toLocaleString('vi-VN');

    if (isLoading || !order) return <p className="p-6">Đang tải chi tiết đơn hàng...</p>;

    return (
        <div className="p-6">
            <Link to="/admin/orders" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Quay lại danh sách</Link>
            <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng #{order._id}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-lg">Sản phẩm trong đơn</h3>
                        {order.orderItems.map(item => (
                            <div key={item._id} className="flex items-center gap-4 border-b py-2 last:border-b-0">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <p>{item.name}</p>
                                    <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                                </div>
                                <p className="ml-auto font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2 text-lg">Lịch sử trạng thái</h3>
                        <table className="min-w-full">
                            <tbody>
                                {[...order.orderStatusHistory].reverse().map((history, index) => (
                                    <tr key={index} className="border-b last:border-b-0">
                                        <td className="py-2 pr-4 font-medium">{history.status}</td>
                                        <td className="py-2 text-gray-500">{formatDate(history.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2 text-lg">Cập nhật trạng thái</h3>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded mb-3">
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button onClick={handleUpdateStatus} disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2 text-lg">Tổng tiền</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Tiền hàng:</span> <span>{formatPrice(order.itemsPrice)}</span></div>
                            
                            {order.discountPrice > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá mã:</span> 
                                    <span>- {formatPrice(order.discountPrice)}</span>
                                </div>
                            )}
                            
                            {order.pointsDiscountPrice > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm từ điểm ({order.redeemedPoints} điểm):</span> 
                                    <span>- {formatPrice(order.pointsDiscountPrice)}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Tổng cộng:</span> <span className="text-red-600">{formatPrice(order.totalPrice)}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-2 text-lg">Thông tin người mua</h3>
                        <p><strong>Tên:</strong> {order.user?.name}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                        <p><strong>Địa chỉ:</strong> {`${order.shippingInfo.address}, ${order.shippingInfo.city}`}</p>
                        <p><strong>SĐT:</strong> {order.shippingInfo.phoneNo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailAdmin;