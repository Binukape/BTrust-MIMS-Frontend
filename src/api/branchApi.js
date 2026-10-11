import axiosClient from './axiosClient.js';

export const listBranches = () => axiosClient.get('/branches').then((r) => r.data);
export const createBranch = (body) => axiosClient.post('/branches', body).then((r) => r.data);
export const updateBranch = (id, body) => axiosClient.put(`/branches/${id}`, body).then((r) => r.data);
export const deleteBranch = (id) => axiosClient.delete(`/branches/${id}`).then((r) => r.data);
