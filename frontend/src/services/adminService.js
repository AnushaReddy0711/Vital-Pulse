import api from './api';
export const getAnalytics = () => api.get('/admin/analytics');
export const getAllUsers   = () => api.get('/admin/users');
