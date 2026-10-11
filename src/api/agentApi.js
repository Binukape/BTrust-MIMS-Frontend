import axiosClient from './axiosClient.js';

export const listAgents = () => axiosClient.get('/agents').then((r) => r.data);
export const createAgent = (body) => axiosClient.post('/agents', body).then((r) => r.data);
export const updateAgent = (id, body) => axiosClient.put(`/agents/${id}`, body).then((r) => r.data);
