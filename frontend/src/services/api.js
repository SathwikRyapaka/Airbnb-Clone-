import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from local storage on each outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('airbnb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error catching
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clear stored session
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('airbnb_token');
        localStorage.removeItem('airbnb_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  updateProfile: (data) => api.put('/auth/profile', data).then((res) => res.data),
  changePassword: (data) => api.put('/auth/password', data).then((res) => res.data),
};

// Listing Service
export const listingService = {
  getAll: (params) => api.get('/listings', { params }).then((res) => res.data),
  getById: (id) => api.get(`/listings/${id}`).then((res) => res.data),
  create: (data) => api.post('/listings', data).then((res) => res.data),
  update: (id, data) => api.put(`/listings/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/listings/${id}`).then((res) => res.data),
  getHostListings: () => api.get('/listings/host/my-listings').then((res) => res.data),
  getFeatured: () => api.get('/listings/featured').then((res) => res.data),
};

// Booking Service
export const bookingService = {
  create: (data) => api.post('/bookings', data).then((res) => res.data),
  getMyTrips: () => api.get('/bookings/my-trips').then((res) => res.data),
  getAvailability: (listingId) =>
    api.get(`/bookings/listing/${listingId}/availability`).then((res) => res.data),
  getHostReservations: () =>
    api.get('/bookings/host/reservations').then((res) => res.data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`).then((res) => res.data),
};

// Review Service
export const reviewService = {
  create: (data) => api.post('/reviews', data).then((res) => res.data),
  getForListing: (listingId) =>
    api.get(`/reviews/listing/${listingId}`).then((res) => res.data),
  delete: (id) => api.delete(`/reviews/${id}`).then((res) => res.data),
};

export default api;
