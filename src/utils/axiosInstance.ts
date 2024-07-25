// utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
    timeout: 5000,
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:', error);
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;