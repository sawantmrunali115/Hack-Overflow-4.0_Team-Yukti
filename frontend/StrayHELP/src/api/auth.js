import api from './axios';

/**
 * Register a new user (username/password flow from Signup form).
 * @param {{ firstName, lastName, email, phone, city, role, password }} formData
 */
export const registerUser = (formData) =>
  api.post('/auth/register/', {
    username: formData.email, // use email as username
    email: formData.email,
    password: formData.password,
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone: formData.phone || '',
    city: formData.city || '',
    role: formData.role || '',
  });

/**
 * Login with username/password.
 */
export const loginUser = (username, password) =>
  api.post('/auth/login/', { username, password });

/**
 * Exchange a Google OAuth2 access_token for JWT tokens.
 */
export const googleAuth = (accessToken) =>
  api.post('/auth/google/', { access_token: accessToken });

/**
 * Get the currently authenticated user's profile.
 */
export const getMe = () => api.get('/auth/me/');

/**
 * Store tokens and user info in localStorage.
 */
export const saveSession = (data) => {
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('strayhelpUser', JSON.stringify(data.user));
  localStorage.setItem('strayhelpIsNgo', data.is_ngo ? 'true' : 'false');
  if (data.picture) {
    const user = JSON.parse(localStorage.getItem('strayhelpUser'));
    user.picture = data.picture;
    localStorage.setItem('strayhelpUser', JSON.stringify(user));
  }
};

/**
 * Returns true if the currently logged-in user is an NGO.
 */
export const isNgoUser = () => localStorage.getItem('strayhelpIsNgo') === 'true';

/**
 * Clear all auth data from localStorage.
 */
export const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('strayhelpUser');
  localStorage.removeItem('strayhelpIsNgo');
};

/**
 * Get stored user object from localStorage.
 */
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('strayhelpUser')) || null;
  } catch {
    return null;
  }
};
