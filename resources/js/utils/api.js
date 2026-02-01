import axios from 'axios';

// Add these axios defaults BEFORE any functions
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Add authorization header interceptor
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Get CSRF token for Sanctum
export const getCsrfToken = async () => {
    await axios.get('/sanctum/csrf-cookie');
};

// Auth API
export const authApi = {
    async register(userData) {
        await getCsrfToken();
        const response = await axios.post('/api/register', userData);
        return response.data;
    },

    async login(credentials) {
        await getCsrfToken();
        const response = await axios.post('/api/login', credentials);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    },

    async logout() {
        const response = await axios.post('/api/logout');
        localStorage.removeItem('auth_token');
        return response.data;
    },

    async getUser() {
        const response = await axios.get('/api/user');
        return response.data;
    }
};

// User API
export const userApi = {
    async getAll() {
        const response = await axios.get('/api/users');
        return response.data;
    },

    async getById(id) {
        const response = await axios.get(`/api/users/${id}`);
        return response.data;
    },

    async update(id, userData) {
        const response = await axios.put(`/api/users/${id}`, userData);
        return response.data;
    },

    async delete(id) {
        const response = await axios.delete(`/api/users/${id}`);
        return response.data;
    }
};

// Admin API
export const adminApi = {
    async getDashboardStats() {
        const response = await axios.get('/api/admin/dashboard');
        return response.data;
    },

    async banUser(userId) {
        const response = await axios.post(`/api/admin/users/${userId}/ban`);
        return response.data;
    },

    async unbanUser(userId) {
        const response = await axios.post(`/api/admin/users/${userId}/unban`);
        return response.data;
    }
};

// User Post
export async function createPost({ content, visibility, imageFile }) {
  const formData = new FormData();
  formData.append('visibility', visibility);
  if (content) formData.append('content', content);
  if (imageFile) formData.append('image', imageFile);

  const res = await axios.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return res.data.post ?? res.data;
}

export async function getPosts() {
  const res = await axios.get('/api/posts');
  return res.data;
}
export async function updatePost(
  id,
  { content, visibility, imageFile, removeImage = false }
) {
  const formData = new FormData();
  if (visibility) formData.append('visibility', visibility);
  if (content !== undefined) formData.append('content', content);
  if (removeImage) formData.append('remove_image', '1');
  if (imageFile) formData.append('image', imageFile);

  const res = await axios.post(`/api/posts/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deletePost(id) {
  await axios.delete(`/api/posts/${id}`);
}