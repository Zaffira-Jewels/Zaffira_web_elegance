import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: (params = {}) => api.get('/products', { params }),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Get featured products
  getFeaturedProducts: () => api.get('/products/featured'),
  
  // Create product (admin only)
  createProduct: (data) => api.post('/products', data),
  
  // Update product (admin only)
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  
  // Delete product (admin only)
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Update product images (admin only)
  updateProductImages: (id, images) => api.put(`/products/${id}/images`, { images }),
};

// Auth API
export const authAPI = {
  // Register user
  register: (data) => api.post('/auth/register', data),
  
  // Login user
  login: (data) => api.post('/auth/login', data),
  
  // Get current user
  getMe: () => api.get('/auth/me'),
};

// Orders API
export const ordersAPI = {
  // Get user orders
  getOrders: () => api.get('/orders'),
  
  // Create order
  createOrder: (data) => api.post('/orders', data),
  
  // Get single order
  getOrder: (id) => api.get(`/orders/${id}`),
};

// Appointments API
export const appointmentsAPI = {
  // Get user appointments
  getAppointments: () => api.get('/appointments'),
  
  // Create appointment
  createAppointment: (data) => api.post('/appointments', data),
  
  // Update appointment
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  
  // Cancel appointment
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
};

export default api;