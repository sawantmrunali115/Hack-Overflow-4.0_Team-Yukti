import api from './axios';

/**
 * Fetch all posts. Optionally filter by tag_area.
 */
export const getPosts = (tagArea) =>
  api.get('/posts/', { params: tagArea ? { tag_area: tagArea } : undefined });

/**
 * Fetch the current user's own posts.
 */
export const getMyPosts = () => api.get('/posts/my/');

/**
 * Submit a new animal report.
 * @param {{ photo: File, location: string, tag_area: string, description: string }} data
 */
export const createPost = (data) => {
  const form = new FormData();
  form.append('photo', data.photo);
  form.append('location', data.location);
  form.append('tag_area', data.tag_area || data.location);
  if (data.description) form.append('description', data.description);
  return api.post('/posts/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Mark a post as rescued (NGO only).
 */
export const markRescued = (postId) =>
  api.patch(`/posts/${postId}/rescue/`);

/**
 * Ask the backend to extract GPS location from image EXIF metadata.
 * Returns { latitude, longitude, location } on success, or 204 if no GPS data.
 * @param {File} photo
 */
export const extractLocation = (photo) => {
  const form = new FormData();
  form.append('photo', photo);
  return api.post('/posts/extract-location/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Fetch all registered NGOs for the Nearby Responders panel.
 */
export const fetchNGOs = () => api.get('/ngo/list/');
