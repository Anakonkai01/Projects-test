import api from '../../utils/axios';

const API_URL = '/products/products_ser'; 
const categories = '/products/categories'
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

// **MỚI: Tạo sản phẩm mới**
const createProduct = async (productData) => {
    const response = await api.post(API_URL, productData);
    return response.data.data;
};

// **MỚI: Cập nhật sản phẩm**
const updateProduct = async ({ id, productData }) => {
    const response = await api.put(`${API_URL}/${id}`, productData);
    return response.data.data;
};

// Xóa sản phẩm
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
    getProductById, // <-- Thêm
    createProduct,  // <-- Thêm
    updateProduct,  // <-- Thêm
    deleteProduct,
    getCategories,
};

export default adminProductService;