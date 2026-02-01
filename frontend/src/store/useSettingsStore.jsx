import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Dashboard Performance
      refreshRate: 5,

      // Alerts Configuration
      criticalHr: 140,
      searchRadius: 5,
      soundAlerts: true,
      autoVerify: true,

      // Map Settings
      defaultRegion: "delhi",

      // Notifications
      emailDigest: false,
      smsAlerts: true,

      // Data Management
      retentionPeriod: "30",

      // Actions
      updateSetting: (key, value) => set((state) => ({ [key]: value })),
      resetSettings: () =>
        set({
          refreshRate: 5,
          criticalHr: 140,
          searchRadius: 5,
          soundAlerts: true,
          autoVerify: true,
          defaultRegion: "delhi",
          emailDigest: false,
          smsAlerts: true,
          retentionPeriod: "30",
        }),
    }),
    {
      name: "saaya-settings", // unique name
    },
  ),
);
