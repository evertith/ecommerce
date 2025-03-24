import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product endpoints
export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (categoryId: string) => api.get(`/products/category/${categoryId}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Category endpoints
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  getSubcategories: (parentId: string) => api.get(`/categories/${parentId}/subcategories`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Cart endpoints
export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (data: any) => api.post('/cart', data),
  updateQuantity: (productId: string, quantity: number) => api.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// Order endpoints
export const orderApi = {
  createOrder: (data: any) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};

// Review endpoints
export const reviewApi = {
  getProductReviews: (productId: string) => api.get(`/reviews/product/${productId}`),
  createReview: (data: any) => api.post('/reviews', data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

// Wishlist endpoints
export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId: string) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),
  isInWishlist: (productId: string) => api.get(`/wishlist/${productId}`),
};

export default api; 