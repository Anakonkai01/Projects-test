import api from '../../utils/axios';

const API_URL = '/products'; 
const categories = '/categories'
// Lấy tất cả sản phẩm
const getProducts = async (queryParams = '') => {
    const response = await api.get(`${API_URL}${queryParams}`);
    return response.data; 
};

// **MỚI: Lấy chi tiết một sản phẩm bằng ID**
const getProductById = async (productId) => {
    const response = await api.get(`${API_URL}/${productId}`);
    return response.data.data;
};

const createProduct = async (productData) => {
    // productData ở đây LÀ FormData
    const response = await api.post(API_URL, productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

const updateProduct = async ({ id, productData }) => {
    // productData ở đây LÀ FormData
    const response = await api.put(`${API_URL}/${id}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

const deleteProduct = async (productId) => {
    const response = await api.delete(`${API_URL}/${productId}`);
    return productId;
};

const getCategories = async () => {
    const response = await api.get(categories);
    return response.data.data;
};

const adminProductService = {
    getProducts,
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct,
    getCategories,
};

export default adminProductService;