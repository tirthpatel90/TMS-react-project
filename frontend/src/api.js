import axios from 'axios';
// backend runs on port 4000 (see backend/server.js). Use full URL for dev server.
const api = axios.create({ baseURL: 'http://localhost:4000/api/v1' });

// Always attach latest token from localStorage to avoid stale header issues
api.interceptors.request.use(cfg => {
  try {
    const t = localStorage.getItem('lv_token');
    if (t) cfg.headers = cfg.headers || {}, cfg.headers['Authorization'] = `Bearer ${t}`;
  } catch (e) {}
  return cfg;
});

// Response interceptor to catch 401s and remove invalid token
api.interceptors.response.use(r => r, err => {
  if (err?.response?.status === 401) {
    try { localStorage.removeItem('lv_token'); localStorage.removeItem('lv_user'); } catch(e){}
    // allow UI to decide; still reject the error
  }
  return Promise.reject(err);
});

export function setToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;
