import axiosClient from './axiosClient.js';

export const getReport = (type, params) =>
  axiosClient.get(`/reports/${type}`, { params }).then((r) => r.data);

export async function downloadReport(type, format, params) {
  const response = await axiosClient.get(`/reports/${type}/export`, {
    params: { ...params, format },
    responseType: 'blob',
  });
  const disposition = response.headers['content-disposition'] || '';
  const match = /filename="([^"]+)"/.exec(disposition);
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = match ? match[1] : `report.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const getAuditLog = (params) => axiosClient.get('/audit-log', { params }).then((r) => r.data);
