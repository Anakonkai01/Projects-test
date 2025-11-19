// E_com/FE/src/features/orders/orderService.js
import api from '../../utils/axios';

const API_URL = '/orders/orders/';

// Tạo đơn hàng mới
const createOrder = async (orderData) => {
    const response = await api.post(API_URL, orderData);
    return response.data.data;
};
const getMyOrders = async () => {
    const response = await api.get(API_URL + 'me');
    return response.data.data; // API trả về { success, count, data }
};
const confirmClientPayment = async (orderId) => {
    const response = await api.put(`${API_URL}/${orderId}/confirm-payment`);
    return response.data.data;
};
const getMyOrderDetails = async (orderId) => {
    // Gọi đến endpoint mới /me/:id
    const response = await api.get(`${API_URL}me/${orderId}`);
    return response.data.data;
};

const orderService = {
    createOrder,
    getMyOrders,
    confirmClientPayment,
    getMyOrderDetails
};

export default orderService;