// Nhan/frontend/src/features/auth/authService.js
import api from "../../utils/axios";

const API_URL = '/auth/'

const register = async (userData) => {
    const response = await api.post(API_URL + 'register', userData);
    if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
    return response.data;
};

// --- SỬA HÀM LOGIN ---
const login = async (userData) => {
    const response = await api.post(API_URL + 'login', userData);
    // Chỉ lưu và trả về phần 'user'
    if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
    return response.data;
};

// Logout user (giữ nguyên)
const logout = () => {
    localStorage.removeItem('user');
};

// Get user data (giữ nguyên)
const getMe = async () => {
    const response = await api.get(API_URL + 'me');
    return response.data.data; 
};

// Update user details (giữ nguyên)
const updateDetails = async (userData) => {
    const response = await api.put(API_URL + 'updatedetails', userData);
    return response.data.data;
};

// === SỬA HÀM UPDATEPASSWORD ===
const updatePassword = async (passwordData) => {
    const response = await api.put(API_URL + 'updatepassword', passwordData);
    // Chỉ lưu và trả về phần 'user'
    if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
    return response.data;
};

// Forgot password (giữ nguyên)
const forgotPassword = async (emailData) => {
    const response = await api.post(API_URL + 'forgotpassword', emailData);
    return response.data;
};

// === SỬA HÀM RESETPASSWORD ===
const resetPassword = async (resetData) => {
    const { resetToken, password } = resetData;
    const response = await api.put(API_URL + `resetpassword/${resetToken}`, { password });
    
    // Chỉ lưu và trả về phần 'user'
    if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
    return response.data;
};

// Các hàm Address (giữ nguyên)
const addAddress = async (addressData) => {
    const response = await api.post(API_URL + 'addresses', addressData);
    return response.data.data; // Trả về user object mới
};

const updateAddress = async ({ addressId, addressData }) => {
    const response = await api.put(API_URL + `addresses/${addressId}`, addressData);
    return response.data.data;
};

const deleteAddress = async (addressId) => {
    const response = await api.delete(API_URL + `addresses/${addressId}`);
    return response.data.data;
};


const authService = {
    register,
    logout,
    login,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword,
    addAddress,
    updateAddress,
    deleteAddress
};

export default authService;