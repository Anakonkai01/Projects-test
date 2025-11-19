// E_com/FE/src/features/discounts/discountService.js
import api from '../../utils/axios';

const API_URL = '/orders/discounts/';

// Gửi mã code lên backend để xác thực
const validateDiscount = async (code) => {
    const response = await api.post(`${API_URL}validate`, { code });
    // Trả về toàn bộ thông tin của mã giảm giá nếu hợp lệ
    return response.data.data; 
};

const discountService = {
    validateDiscount,
};

export default discountService;