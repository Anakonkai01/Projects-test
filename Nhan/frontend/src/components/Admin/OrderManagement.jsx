// E_com/FE/src/components/Admin/OrderManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrders } from '../../features/admin/adminOrderSlice';
import Pagination from '../Common/Pagination';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
    const dispatch = useDispatch();
    const { orders, pagination, isLoading } = useSelector(state => state.adminOrders);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getAdminOrders(`?page=${currentPage}`));
    }, [dispatch, currentPage]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý Đơn Hàng</h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="min-w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="py-3 px-6">Mã ĐH</th>
                            <th className="py-3 px-6">Ngày Đặt</th>
                            <th className="py-3 px-6">Tổng Tiền</th>
                            <th className="py-3 px-6">Trạng Thái</th>
                            <th className="py-3 px-6">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center p-4">Đang tải...</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium">{order._id}</td>
                                    <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
                                    <td className="py-4 px-6 font-semibold">{formatPrice(order.totalPrice)}</td>
                                    <td className="py-4 px-6">{order.orderStatusHistory.slice(-1)[0].status}</td>
                                    <td className="py-4 px-6">
                                        <Link to={`/admin/orders/${order._id}`} className="text-blue-500 hover:underline">
                                            Xem & Cập nhật
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={pagination?.currentPage || 1}
                totalPages={pagination?.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default OrderManagement;