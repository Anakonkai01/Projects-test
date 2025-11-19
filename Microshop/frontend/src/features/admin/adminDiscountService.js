import api from '../../utils/axios';

const API_URL = '/orders/discounts/';

// Lấy tất cả mã giảm giá
const getDiscounts = async () => {
    const response = await api.get(API_URL);
    return response.data.data;
};

// Tạo mã giảm giá mới
const createDiscount = async (discountData) => {
    const response = await api.post(API_URL, discountData);
    return response.data.data;
};

// Xóa mã giảm giá
const deleteDiscount = async (id) => {
    await api.delete(API_URL + id);
    return id; // Trả về id để xóa khỏi state
};

const adminDiscountService = {
    getDiscounts,
    createDiscount,
    deleteDiscount,
};

export default adminDiscountService;