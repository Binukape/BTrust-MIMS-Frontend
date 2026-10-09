import axiosClient from './axiosClient.js';

export const deposit = (account_id, amount) =>
  axiosClient.post('/transactions/deposit', { account_id, amount }).then((r) => r.data);
export const withdraw = (account_id, amount) =>
  axiosClient.post('/transactions/withdraw', { account_id, amount }).then((r) => r.data);
export const listTransactions = (params) =>
  axiosClient.get('/transactions', { params }).then((r) => r.data);
