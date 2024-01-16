// axiosReq.js
import axios from 'axios';


const axiosReq = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

// Lägg till en interceptor som sätter Authorization-headern
axiosReq.interceptors.request.use(config => {
  // Hämta token från där den lagras (t.ex. localStorage)
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosReq;