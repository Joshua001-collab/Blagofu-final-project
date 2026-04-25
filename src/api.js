const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchAPI(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (username, password) =>
    fetchAPI('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  
  changePassword: (currentPassword, newPassword) =>
    fetchAPI('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Hero
  getHero: () => fetchAPI('/api/hero'),
  updateHero: (formData) =>
    fetchAPI('/api/hero', {
      method: 'PUT',
      body: formData,
    }),

  // Products
  getProducts: () => fetchAPI('/api/products'),
  createProduct: (formData) =>
    fetchAPI('/api/products', {
      method: 'POST',
      body: formData,
    }),
  updateProduct: (id, formData) =>
    fetchAPI(`/api/products/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  deleteProduct: (id) =>
    fetchAPI(`/api/products/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: () => fetchAPI('/api/reviews'),
  createReview: (formData) =>
  fetchAPI('/api/reviews', {
    method: 'POST',
    body: formData,
  }),
updateReview: (id, formData) =>
  fetchAPI(`/api/reviews/${id}`, {
    method: 'PUT',
    body: formData,
  }),
  deleteReview: (id) =>
    fetchAPI(`/api/reviews/${id}`, { method: 'DELETE' }),

  // Contacts
  getContacts: () => fetchAPI('/api/contacts'),
  updateContacts: (data) =>
    fetchAPI('/api/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Messages
  getMessages: () => fetchAPI('/api/messages'),
  createMessage: (data) =>
    fetchAPI('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  markMessageRead: (id) =>
    fetchAPI(`/api/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) =>
    fetchAPI(`/api/messages/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchAPI('/api/settings'),
  updateSettings: (data) =>
    fetchAPI('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Images
  deleteImage: (filename) =>
    fetchAPI(`/api/images/${filename}`, { method: 'DELETE' }),
};
