// File này chịu trách nhiệm gọi API product
import api from '../../utils/axios';

const API_URL = '/products';

// Hàm fetch sản phẩm chung dựa trên query (ví dụ: ?sort=-sold)
const getProducts = async (queryParams = '') => {
    const response = await api.get(`${API_URL}${queryParams}`);
    return response.data; 
};

const getProductById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data.data;
};

const productService = {
    getProducts,
    getProductById
};

export default productService;