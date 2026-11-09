import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Home
  getChartPagu: (tahun) => api.get('/home/getChartData', { params: { tahun } }),
  getChartRealisasi: (tahun) => api.get('/home/getChartRealisasi', { params: { tahunrealisasi: tahun } }),

  // Contacts
  getContactsList: () => api.get('/contacts'),
  uploadFile: (formData) => api.post('/contacts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCreateForm: () => api.get('/contacts/new')
};

export default api;
