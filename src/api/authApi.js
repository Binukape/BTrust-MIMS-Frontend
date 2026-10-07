import axiosClient from './axiosClient.js';

export const login = (username, password) =>
  axiosClient.post('/auth/login', { username, password }).then((r) => r.data);
