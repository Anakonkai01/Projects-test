// E_com/FE/src/features/payments/paymentService.js
import api from '../../utils/axios';

const API_URL = '/orders/payments/';

// Gọi API để lấy URL thanh toán VNPay
const createPaymentUrl = async (paymentData) => {
    const response = await api.post(`${API_URL}create_payment_url`, paymentData);
    return response.data.data; // API trả về URL
};

const paymentService = {
    createPaymentUrl,
};

export default paymentService;