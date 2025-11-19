// E_com/FE/src/features/admin/dashboardService.js
import api from '../../utils/axios';

// Lấy thống kê từ users-service
const getUserStats = async () => {
    const response = await api.get('/users/users-stats/summary');
    return response.data.data;
};

// Lấy thống kê từ orders-service
const getOrderStats = async () => {
    const response = await api.get('/orders/orders-stats/summary');
    return response.data.data;
};

// Lấy thống kê từ products-service
const getProductStats = async () => {
    const response = await api.get('/products/products-stats/summary');
    return response.data.data;
};
const getSalesStats = async (params) => {
    const response = await api.get('/orders/orders-stats/sales', { params }); // Gửi params qua query string
    return response.data.data;
};
const dashboardService = {
    getUserStats,
    getOrderStats,
    getProductStats,
    getSalesStats
};

export default dashboardService;