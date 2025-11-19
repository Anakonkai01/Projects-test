// E_com/FE/src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Chú ý: Chúng ta sẽ tái sử dụng service và slice của admin để lấy chi tiết đơn hàng bằng ID
import { getAdminOrderById, reset } from '../features/admin/adminOrderSlice';
import { cancelOrder } from '../features/orders/orderSlice';
import { toast } from 'sonner';

const OrderDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    
    // Lấy state từ adminOrders slice
    const { order, isLoading, isError, message } = useSelector(state => state.adminOrders);
    const { isLoading: cancelLoading } = useSelector(state => state.order);

    useEffect(() => {
        if (isError) toast.error(message);
        dispatch(getAdminOrderById(id));
        return () => dispatch(reset());
    }, [dispatch, id, isError, message]);
    
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (date) => new Date(date).toLocaleString('vi-VN');
    
    // Hàm xử lý hủy đơn hàng
    const handleCancelOrder = async () => {
        try {
            await dispatch(cancelOrder(id)).unwrap();
            toast.success('Đơn hàng đã được hủy thành công!');
            setShowCancelConfirm(false);
            // Tải lại thông tin đơn hàng
            dispatch(getAdminOrderById(id));
        } catch (error) {
            toast.error(error || 'Không thể hủy đơn hàng');
        }
    };
    
    // Kiểm tra xem đơn hàng có thể hủy không
    const canCancelOrder = () => {
        if (!order || !order.orderStatusHistory || order.orderStatusHistory.length === 0) return false;
        // Lấy trạng thái hiện tại từ orderStatusHistory (phần tử cuối cùng)
        const currentStatus = order.orderStatusHistory[order.orderStatusHistory.length - 1].status;
        // Chỉ cho phép hủy khi đơn hàng đang ở trạng thái Pending
        return currentStatus === 'Pending';
    };

    // Lấy trạng thái hiện tại của đơn hàng
    const getCurrentStatus = () => {
        if (!order || !order.orderStatusHistory || order.orderStatusHistory.length === 0) return 'Unknown';
        return order.orderStatusHistory[order.orderStatusHistory.length - 1].status;
    };

    if (isLoading || !order) {
        return <p className="p-10 text-center">Đang tải chi tiết đơn hàng...</p>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Link to="/profile" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Quay lại trang cá nhân</Link>
            <h1 className="text-3xl font-bold mb-6">Chi Tiết Đơn Hàng #{order._id}</h1>

            {/* Modal xác nhận hủy đơn */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Xác nhận hủy đơn hàng</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={() => setShowCancelConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                disabled={cancelLoading}
                            >
                                Không
                            </button>
                            <button 
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        
                        {/* Trạng thái đơn hàng */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 font-medium">Trạng thái:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    getCurrentStatus() === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    getCurrentStatus() === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    getCurrentStatus() === 'Shipping' ? 'bg-blue-100 text-blue-800' :
                                    getCurrentStatus() === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {getCurrentStatus()}
                                </span>
                            </div>
                        </div>
                        
                        {/* Nút hủy đơn hàng - Hiển thị ở cuối phần Tóm tắt */}
                        {canCancelOrder() && (
                            <div className="mt-6 pt-4 border-t">
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Địa chỉ giao hàng */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold mb-4 text-xl">Địa chỉ giao hàng</h3>
                        <p className="font-bold">{order.user?.name}</p>
                        <p>{order.shippingInfo.phoneNo}</p>
                        <p>{`${order.shippingInfo.address}, ${order.shippingInfo.city}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;