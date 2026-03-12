import api from './axios';

/**
 * Fetch the NGO dashboard data (authenticated NGO user only).
 * Returns { ngo, posts }
 */
export const fetchNgoDashboard = () => api.get('/ngo/dashboard/');

/**
 * Mark a post as rescued by the current NGO.
 */
export const markRescued = (postId) => api.patch(`/ngo/posts/${postId}/rescue/`);
