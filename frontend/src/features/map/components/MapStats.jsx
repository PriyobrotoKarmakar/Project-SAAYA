import { Card } from "@/components/ui/card";
import { Activity, Shield, Siren, Navigation } from "lucide-react";

export function MapStats({ alerts, stations, routesCount }) {
  const sosCount = alerts.filter((a) => a.status === "SOS").length;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] grid grid-cols-2 gap-2 md:flex md:flex-row">
      {/* Active Alerts (SOS) */}
      <Card className="p-2 min-w-[120px] bg-background/90 border-border shadow-md backdrop-blur-none flex flex-col justify-center">
        <div className="flex items-center gap-2 text-red-500 mb-1">
          <Siren className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold uppercase">Active SOS</span>
        </div>
        <div className="text-xl font-bold">{sosCount}</div>
      </Card>

      {/* Total Alerts */}
      <Card className="p-2 min-w-[120px] bg-background/90 border-border shadow-md backdrop-blur-none flex flex-col justify-center">
        <div className="flex items-center gap-2 text-blue-500 mb-1">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Total Alerts</span>
        </div>
        <div className="text-xl font-bold">{alerts.length}</div>
      </Card>

      {/* Police Stations */}
      <Card className="p-2 min-w-[120px] bg-background/90 border-border shadow-md backdrop-blur-none flex flex-col justify-center">
        <div className="flex items-center gap-2 text-emerald-500 mb-1">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Stations</span>
        </div>
        <div className="text-xl font-bold">{stations.length}</div>
      </Card>

      {/* Routes */}
      <Card className="p-2 min-w-[120px] bg-background/90 border-border shadow-md backdrop-blur-none flex flex-col justify-center">
        <div className="flex items-center gap-2 text-purple-500 mb-1">
          <Navigation className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">Routes</span>
        </div>
        <div className="text-xl font-bold">{routesCount}</div>
      </Card>
    </div>
  );
}
