import api from './api';
export const getAllDonors       = ()                      => api.get('/donors');
export const registerDonor      = (data)                  => api.post('/donors', data);
export const matchDonors        = (bloodGroup, city)      => api.get('/donors/match', { params: { bloodGroup, city } });
export const getDonorByUser     = (userId)                => api.get(`/donors/user/${userId}`);
export const updateEligibility  = (donorId, eligible)     => api.put(`/donors/${donorId}/eligibility`, null, { params: { eligible } });
