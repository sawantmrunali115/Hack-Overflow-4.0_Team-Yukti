import api from './axios';

/**
 * Fetch all community blog posts.
 */
export const getBlogs = () => api.get('/community/blogs/');

/**
 * Fetch a single blog post by ID.
 */
export const getBlog = (id) => api.get(`/community/blogs/${id}/`);

/**
 * Create a new blog post.
 * @param {{ title: string, content: string, img?: File }} data
 */
export const createBlog = (data) => {
  const form = new FormData();
  form.append('title', data.title);
  form.append('content', data.content);
  if (data.img) form.append('img', data.img);
  return api.post('/community/blogs/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
