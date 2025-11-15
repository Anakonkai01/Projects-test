import api from '../../utils/axios';
const API_URL = '/users/users'; 

const getUsers = async (queryParams = '') => {
    const response = await api.get(`${API_URL}${queryParams}`);
    return response.data; // Trả về toàn bộ object { data, pagination }
};

const updateUser = async ({ id, userData }) => {
    const response = await api.put(`${API_URL}/${id}`, userData);
    return response.data.data;
};

const deleteUser = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return id; // Trả về id để slice có thể xóa user khỏi state
};

const adminService = { getUsers, updateUser, deleteUser };
export default adminService;