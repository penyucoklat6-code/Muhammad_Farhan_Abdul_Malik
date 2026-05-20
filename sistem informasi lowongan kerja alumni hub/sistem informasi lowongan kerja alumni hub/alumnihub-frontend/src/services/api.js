import axios from 'axios';

// Menentukan URL secara dinamis berdasarkan IP/hostname saat ini agar dapat diakses via Mobile/Tab
const hostname = window.location.hostname;
const API_URL = `http://${hostname}:8000/api`;
export const STORAGE_URL = `http://${hostname}:8000/media`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Interceptor untuk menambahkan token dan mengatur Content-Type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Jangan set Content-Type untuk FormData — biarkan browser yang atur
  // agar boundary multipart terisi dengan benar
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default api;

