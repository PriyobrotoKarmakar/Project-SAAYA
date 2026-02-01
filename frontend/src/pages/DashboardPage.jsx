import { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore.jsx";
import StatsGrid from "@/features/dashboard/StatsGrid";
import AlertsList from "@/features/alerts/AlertsList";
import LiveMapView from "@/features/map/LiveMapView";
import { mockAlerts } from "@/utils/mockData";

export default function DashboardPage() {
  const alerts = useDashboardStore((state) => state.alerts);
  const verifiedRoutes = useDashboardStore((state) => state.verifiedRoutes);
  const activeAlertsCount = alerts.filter((a) => a.status === "SOS").length;
  const fetchAlerts = useDashboardStore((state) => state.fetchAlerts);
  const addSimulatedAlert = useDashboardStore(
    (state) => state.addSimulatedAlert,
  );

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Simulate incoming alerts sequentially
  useEffect(() => {
    let currentIndex = 0;

    // Initial delay before starting
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < mockAlerts.length) {
          const alert = mockAlerts[currentIndex];
          // Update timestamp to now so it looks fresh
          const freshAlert = { ...alert, timestamp: new Date().toISOString() };
          addSimulatedAlert(freshAlert);
          currentIndex++;
        } else {
          clearInterval(interval); // Stop when done
        }
      }, 5000); // 5 seconds between each alert

      return () => clearInterval(interval);
    }, 2000); // Start 2 seconds after mount

    return () => clearTimeout(startDelay);
  }, [addSimulatedAlert]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 p-4 md:p-6 space-y-6 overflow-hidden">
          <StatsGrid count={activeAlertsCount} />

          <div className="w-full flex-1 min-h-0 rounded-xl overflow-hidden border border-border">
            <LiveMapView
              alerts={alerts}
              verifiedRoutes={verifiedRoutes}
              minimal={true}
            />
          </div>
        </div>
      </div>

      <aside className="hidden xl:flex w-[400px] flex-col h-full border-l border-border bg-muted/10 shrink-0">
        <div className="flex flex-col h-full p-4 overflow-hidden">
          <AlertsList />
        </div>
      </aside>
    </div>
  );
}
