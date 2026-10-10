import axiosClient from './axiosClient.js';

export const listAccounts = (params) => axiosClient.get('/accounts', { params }).then((r) => r.data);
export const getAccount = (id) => axiosClient.get(`/accounts/${id}`).then((r) => r.data);
export const openAccount = (body) => axiosClient.post('/accounts', body).then((r) => r.data);
export const changeAccountStatus = (id, status) =>
  axiosClient.post(`/accounts/${id}/status`, { status }).then((r) => r.data);
export const closeAccount = (id) => axiosClient.post(`/accounts/${id}/close`).then((r) => r.data);
export const listSavingsPlans = () => axiosClient.get('/reference/savings-plans').then((r) => r.data);
export const listFdPlans = () => axiosClient.get('/reference/fd-plans').then((r) => r.data);
