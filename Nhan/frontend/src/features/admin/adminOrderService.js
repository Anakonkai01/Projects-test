// E_com/FE/src/features/admin/adminOrderService.js
import api from '../../utils/axios';

const API_URL = '/orders/orders';

const getOrders = async (queryParams = '') => {
    const response = await api.get(`${API_URL}${queryParams}`);
    return response.data;
};

const getOrderById = async (orderId) => {
    const response = await api.get(`${API_URL}/${orderId}`);
    return response.data.data;
};

// HÀM MỚI: Cập nhật trạng thái
const updateOrderStatus = async ({ orderId, status }) => {
    const response = await api.put(`${API_URL}/${orderId}/status`, { status });
    return response.data.data;
};


const adminOrderService = {
    getOrders,
    getOrderById,
    updateOrderStatus,
};
export default adminOrderService;