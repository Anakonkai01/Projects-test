import api from '../../utils/axios';

const API_URL = '/products/products_ser/';

// Tạo hoặc cập nhật review
const createReview = async (productId, reviewData) => {
    const response = await api.put(`${API_URL}/${productId}/reviews`, reviewData);
    return response.data;
};

// Lấy tất cả review của một sản phẩm
const getReviews = async (productId) => {
    const response = await api.get(`${API_URL}/${productId}/reviews`);
    return response.data.reviews;
};

const reviewService = {
    createReview,
    getReviews,
};

export default reviewService;