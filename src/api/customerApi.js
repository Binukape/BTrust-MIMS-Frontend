import axiosClient from './axiosClient.js';

export const listCustomers = (q) =>
  axiosClient.get('/customers', { params: q ? { q } : {} }).then((r) => r.data);
export const registerCustomer = (body) => axiosClient.post('/customers', body).then((r) => r.data);
