import api from './api';
export const addInventory          = (data)                 => api.post('/inventory', data);
export const getAllInventory        = ()                     => api.get('/inventory');
export const getInventoryByHospital= (hospitalUserId)       => api.get(`/inventory/hospital/${hospitalUserId}`);
export const updateInventory       = (id, units)            => api.put(`/inventory/${id}`, null, { params: { units } });
export const deleteInventory       = (id)                   => api.delete(`/inventory/${id}`);
export const getLowStock           = (threshold = 10)       => api.get('/inventory/low-stock', { params: { threshold } });
