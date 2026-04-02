import api from './api';
export const createRequest         = (data)         => api.post('/requests', data);
export const getAllRequests         = ()             => api.get('/requests');
export const getRequestsByPatient  = (patientId)    => api.get(`/requests/patient/${patientId}`);
export const updateStatus          = (id, status, hospitalUserId = null) => 
  api.put(`/requests/${id}/status`, null, { params: { status, hospitalUserId } });
export const matchDonorsForRequest = (bloodGroup, city) => api.get('/requests/match', { params: { bloodGroup, city } });
