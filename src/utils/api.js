import axios from 'axios';

// ✅ Set backend base URL — you can later move this to an environment variable
const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

//
// ===================== 🔐 AUTH API =====================
//
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};

//
// ===================== 🎥 SCREENS API =====================
//
export const screensAPI = {
  getMyScreens: async () => {
    const response = await api.get('/api/screens/me/screens');
    return response.data;
  },

  getTenants: async () => {
    const response = await api.get('/api/screens/tenants');
    return response.data;
  },
};

//
// ===================== 🎫 TICKETS API =====================
//
export const ticketsAPI = {
  getTickets: async (params = {}) => {
    const response = await api.get('/api/tickets', { params });
    return response.data;
  },

  getTicket: async (id) => {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    const response = await api.post('/api/tickets', ticketData);
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await api.put(`/api/tickets/${id}/status`, { status });
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await api.delete(`/api/tickets/${id}`);
    return response.data;
  },
};

//
// ===================== 🔧 AUTH UTILITIES =====================
//

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// ✅ Export the configured Axios instance
export default api;
