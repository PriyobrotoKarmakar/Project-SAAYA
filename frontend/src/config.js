const BACKEND_IP = import.meta.env.VITE_BACKEND_IP || 'localhost';
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '5000';

export const API_BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api`;

export const API_ENDPOINTS = {
  ALERTS: `${API_BASE_URL}/alerts`,
  HEALTH: `${API_BASE_URL}/health`,
  STATS: `${API_BASE_URL}/stats`,
  TELEMETRY: `${API_BASE_URL}/telemetry`,
  CLEAR: `${API_BASE_URL}/clear-all`,
};

export const getDeleteAlertUrl = (deviceId, timestamp) => {
  return `${API_ENDPOINTS.ALERTS}/${encodeURIComponent(deviceId)}/${encodeURIComponent(timestamp)}`;
};

export default { API_BASE_URL, API_ENDPOINTS, getDeleteAlertUrl };
