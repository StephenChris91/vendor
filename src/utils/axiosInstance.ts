// utils/axiosInstance.ts

import axios from "axios";

// Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add any custom logic here, such as adding auth tokens
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // You can add custom error handling here
        return Promise.reject(error);
    }
);

export default axiosInstance;