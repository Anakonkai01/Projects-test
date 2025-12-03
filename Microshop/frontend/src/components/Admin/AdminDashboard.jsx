// E_com/FE/src/components/Admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../features/admin/dashboardSlice';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaDollarSign } from 'react-icons/fa';
import AdvancedDashboard from './AdvancedDashboard';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading, isError, message } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const formatCurrency = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number || 0);

    // Đảm bảo bestSellers luôn là array
    const bestSellers = Array.isArray(stats.bestSellers) ? stats.bestSellers : [];

    const bestSellersData = {
        labels: bestSellers.map(p => p.name),
        datasets: [{
            label: 'Số lượng đã bán',
            data: bestSellers.map(p => p.sold),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    if (isLoading) {
        return <div className="p-6">Đang tải dữ liệu...</div>;
    }

    if (isError) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    <p className="font-semibold">Lỗi tải dữ liệu</p>
                    <p className="text-sm">{message}</p>
                    <button 
                        onClick={() => dispatch(fetchDashboardStats())}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>
            
            {/* Các thẻ thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<FaDollarSign />} title="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} color="border-green-500" />
                <StatCard icon={<FaShoppingCart />} title="Tổng đơn hàng" value={stats.totalOrders} color="border-blue-500" />
                <StatCard icon={<FaUsers />} title="Tổng người dùng" value={stats.totalUsers} color="border-purple-500" />
                <StatCard icon={<FaBoxOpen />} title="Tổng sản phẩm" value={stats.totalProducts} color="border-yellow-500" />
            </div>

            {/* Biểu đồ */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Top 5 sản phẩm bán chạy nhất</h2>
                {bestSellers.length > 0 ? (
                    <Bar 
                        data={bestSellersData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Số lượng sản phẩm đã bán' },
                            },
                        }}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Chưa có dữ liệu sản phẩm bán chạy</p>
                        <p className="text-sm mt-2">Thêm sản phẩm và đơn hàng để xem thống kê</p>
                    </div>
                )}
            </div>
            <AdvancedDashboard />
        </div>
    );
};

export default AdminDashboard;