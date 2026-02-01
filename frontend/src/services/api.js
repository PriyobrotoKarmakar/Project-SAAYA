import axios from "axios";

import { auth } from "@/lib/firebase"; // Import auth

// Uses the variable we just set: http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

// INTERCEPTOR: Automatically attach Firebase Token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Fetch Alerts (Matches GET /api/alerts)
export const fetchRealAlerts = async () => {
  try {
    const response = await api.get("/alerts");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return null;
  }
};

// 2. Dismiss Alert (Matches DELETE /api/alerts/:deviceId/:timestamp)
export const dismissAlertApi = async (deviceId, timestamp) => {
  try {
    // Backend expects: /alerts/Saaya_001/2023-10-27T10:00:00Z
    // We encodeURIComponent to ensure special characters in timestamp don't break the URL
    await api.delete(`/alerts/${deviceId}/${encodeURIComponent(timestamp)}`);
    return true;
  } catch (error) {
    console.error("Failed to dismiss alert:", error);
    return false;
  }
};

// 3. System Health (Matches GET /api/health)
export const checkSystemHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data; // Should return { status: 'ok' }
  } catch (error) {
    return { status: "offline" };
  }
};
