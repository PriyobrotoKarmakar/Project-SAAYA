import { create } from "zustand";
import { toast } from "sonner";
import { AlertToast } from "@/features/alerts/components/AlertToast";
import { fetchRealAlerts, dismissAlertApi } from "@/services/api";

import {
  findNearestPoliceStation,
  getRouteColor,
} from "@/utils/policeStations";

export const useDashboardStore = create((set, get) => ({
  alerts: [],
  simulatedAlerts: [], // Store manually added alerts
  verifiedRoutes: new Map(),
  previousAlertCount: 0,

  // User State
  user: {
    name: "Administrator",
    email: "admin@saaya.gov",
    role: "police",
    avatar: "/avatars/01.png",
  },

  updateUserRole: (role) =>
    set((state) => ({
      user: { ...state.user, role },
    })),

  fetchAlerts: async () => {
    try {
      const realData = await fetchRealAlerts();
      // MODIFIED: Do NOT fallback to bulk mock alerts. Start empty or with real data.
      const baseData = realData && realData.length > 0 ? realData : [];

      const { simulatedAlerts } = get();

      // Merge base data with simulated alerts
      const newData = [...simulatedAlerts, ...baseData];

      set({ alerts: newData });

      // Removed the toast logic here to avoid double toasts if the simulation handles it.
      // Or keep it for real data? Keeping it for real data is fine.
    } catch (error) {
      console.error("Failed to update alerts", error);
      set({ alerts: [] }); // Fallback to empty, not mockAlerts
    }
  },

  addSimulatedAlert: (newAlert) => {
    set((state) => {
      const updatedSimulated = [newAlert, ...state.simulatedAlerts];
      const updatedAlerts = [newAlert, ...state.alerts];

      // Trigger persistent toast ONLY for SOS alerts
      if (newAlert.status === "SOS") {
        toast.custom((t) => <AlertToast alert={newAlert} onClose={t} />, {
          duration: 5000,
          position: "top-center", // Ensure consistent positioning
        });
      }

      return {
        simulatedAlerts: updatedSimulated,
        alerts: updatedAlerts,
      };
    });
  },

  verifyAlert: (alert) => {
    if (!alert.coordinates) return;

    const nearestStation = findNearestPoliceStation(alert.coordinates);

    if (nearestStation) {
      const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}`;

      set((state) => {
        const routeInfo = {
          alertCoordinates: alert.coordinates,
          stationCoordinates: nearestStation.coordinates,
          stationName: nearestStation.name,
          stationContact: nearestStation.contact,
          stationCity: nearestStation.city,
          distance: nearestStation.distance.toFixed(2),
          deviceId: alert.deviceId,
          color: getRouteColor(state.verifiedRoutes.size),
        };

        const newRoutes = new Map(state.verifiedRoutes);
        newRoutes.set(uniqueAlertId, routeInfo);

        return { verifiedRoutes: newRoutes };
      });
    }
  },

  removeAlert: (alert) => {
    // Optimistic UI Update first
    set((state) => {
      const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}`;

      const newRoutes = new Map(state.verifiedRoutes);
      newRoutes.delete(uniqueAlertId);

      return {
        alerts: state.alerts.filter(
          (a) =>
            a.deviceId !== alert.deviceId || a.timestamp !== alert.timestamp,
        ),
        verifiedRoutes: newRoutes,
      };
    });

    // Fire and forget backend sync
    dismissAlertApi(alert.deviceId, alert.timestamp).then((success) => {
      if (success) {
        toast.success("Alert dismissed from backend");
      } else {
        toast.error("Failed to sync dismissal with server");
      }
    });
  },

  updateAlertStatus: (alert, newStatus) => {
    set((state) => {
      const updatedAlerts = state.alerts.map((a) => {
        if (a.deviceId === alert.deviceId && a.timestamp === alert.timestamp) {
          return { ...a, status: newStatus };
        }
        return a;
      });

      // If resolved, remove from verified routes
      let newRoutes = state.verifiedRoutes;
      if (newStatus === "RESOLVED") {
        const uniqueAlertId = `${alert.deviceId}_${alert.timestamp}`;
        if (state.verifiedRoutes.has(uniqueAlertId)) {
          newRoutes = new Map(state.verifiedRoutes);
          newRoutes.delete(uniqueAlertId);
        }
      }

      return {
        alerts: updatedAlerts,
        verifiedRoutes: newRoutes,
      };
    });
  },
}));
