import axiosClient from './axiosClient.js';

export const listFixedDeposits = (account_id) =>
  axiosClient.get('/fixed-deposits', { params: { account_id } }).then((r) => r.data);
export const openFixedDeposit = (body) => axiosClient.post('/fixed-deposits', body).then((r) => r.data);
export const earlyClosurePreview = (id) =>
  axiosClient.get(`/fixed-deposits/${id}/early-closure-preview`).then((r) => r.data);
export const closeFixedDepositEarly = (id) =>
  axiosClient.post(`/fixed-deposits/${id}/close-early`).then((r) => r.data);
