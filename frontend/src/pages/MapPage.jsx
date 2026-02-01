import LiveMapView from "@/features/map/LiveMapView";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect } from "react";

export default function MapPage() {
  const alerts = useDashboardStore((state) => state.alerts);
  const verifiedRoutes = useDashboardStore((state) => state.verifiedRoutes);
  const fetchAlerts = useDashboardStore((state) => state.fetchAlerts);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return (
    <div className="h-full w-full relative">
      <LiveMapView
        alerts={alerts}
        verifiedRoutes={verifiedRoutes}
        minimal={false}
      />
    </div>
  );
}
