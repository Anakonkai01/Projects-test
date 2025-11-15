import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, //
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user')); // get data user from localStorage
        
        if (user && user.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`; // token with header
        }
        return config; // send request with hearder updated
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;