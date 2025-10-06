import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  updateStock: (id, quantity) => api.patch(`/products/${id}/stock`, { quantity }),
};

// Cart API
export const cartAPI = {
  addItem: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  getSummary: () => api.get('/cart/summary'),
  clearCart: () => api.delete('/cart/clear'),
  removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
  updateItem: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity }),
  checkout: () => api.post('/checkout')
};

// Discount Rules API
export const discountAPI = {
  getAll: () => api.get('/discount-rules'),
  create: (ruleData) => api.post('/discount-rules', ruleData),
};

export default api;