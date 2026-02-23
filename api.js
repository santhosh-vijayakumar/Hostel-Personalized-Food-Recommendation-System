import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Debug
api.interceptors.request.use(request => {
    console.log('➡️ API:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('✅ API OK:', response.config.url, response.data);
        return response;
    },
    error => {
        console.error('API FAIL:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;