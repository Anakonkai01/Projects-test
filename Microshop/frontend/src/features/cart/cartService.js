// Nhan/frontend/src/features/cart/cartService.js
import api from '../../utils/axios';

const API_URL = '/auth/cart';

const fetchCart = async () => {
    const response = await api.get(API_URL);
    return response.data.cart; 
};

const saveCart = async (cartItems) => {
    const response = await api.put(API_URL, { cart: cartItems });
    return response.data;
};

const cartService = {
    fetchCart,
    saveCart,
};

export default cartService;