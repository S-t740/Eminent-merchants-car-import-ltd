import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login if needed
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updatePassword: (data) => api.put('/auth/password', data)
};

// Vehicles API
export const vehiclesAPI = {
    getAll: (params) => api.get('/vehicles', { params }),
    getById: (id) => api.get(`/vehicles/${id}`),
    getFeatured: () => api.get('/vehicles/featured'),
    getStats: () => api.get('/vehicles/stats'),
    create: (data) => api.post('/vehicles', data),
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    delete: (id) => api.delete(`/vehicles/${id}`),
    uploadImages: (id, formData) => api.post(`/vehicles/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteImage: (id, publicId) => api.delete(`/vehicles/${id}/images/${publicId}`)
};

// Offers API
export const offersAPI = {
    getAll: (params) => api.get('/offers', { params }),
    getById: (id) => api.get(`/offers/${id}`),
    create: (data) => api.post('/offers', data),
    update: (id, data) => api.put(`/offers/${id}`, data),
    delete: (id) => api.delete(`/offers/${id}`)
};

// Inquiries API
export const inquiriesAPI = {
    getAll: (params) => api.get('/inquiries', { params }),
    create: (data) => api.post('/inquiries', data),
    update: (id, data) => api.put(`/inquiries/${id}`, data),
    delete: (id) => api.delete(`/inquiries/${id}`),
    getStats: () => api.get('/inquiries/stats')
};

export default api;
