import { useDashboardStore } from "@/store/useDashboardStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Activity, Clock, X } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function AlertsList() {
  const allAlerts = useDashboardStore((state) => state.alerts);
  const alerts = allAlerts.filter((a) => a.status === "SOS");
  const verifyAlert = useDashboardStore((state) => state.verifyAlert);
  const removeAlert = useDashboardStore((state) => state.removeAlert);

  if (alerts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground border-l border-border bg-muted/10 rounded-xl">
        No Active Alerts
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-muted/10 border border-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-lg">Recent Alerts</h3>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        >
          {alerts.length} Active
        </Badge>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {alerts.map((alert, index) => {
              const isSOS = alert.status === "SOS";
              const isHealthy = !isSOS;

              // Parse timestamp to show only time
              let timeDisplay = alert.timestamp;
              try {
                // Attempt to parse if it's a date string, otherwise keep as is
                const date = new Date(alert.timestamp);
                if (!isNaN(date.getTime())) {
                  timeDisplay = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
              } catch {
                // fallback to original if parsing fails
              }

              return (
                <Item
                  key={`${alert.deviceId}-${index}`}
                  className={`
                    border transition-all
                    ${
                      isHealthy
                        ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                    }
                  `}
                >
                  <ItemMedia
                    variant="icon"
                    className={isHealthy ? "text-emerald-500" : "text-red-500"}
                  >
                    {isHealthy ? (
                      <Activity className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </ItemMedia>

                  <ItemContent>
                    <ItemTitle className="flex justify-between w-full">
                      <span>{alert.deviceId}</span>
                      <span className="text-xs font-normal opacity-70 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeDisplay}
                      </span>
                    </ItemTitle>
                    <ItemDescription className="text-xs opacity-90">
                      {alert.location} • {alert.heartRate} BPM
                    </ItemDescription>
                  </ItemContent>

                  <ItemActions>
                    <Button
                      size="sm"
                      variant={isSOS ? "destructive" : "default"}
                      className={`
                        h-8 text-xs font-medium
                        ${isHealthy ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""}
                      `}
                      onClick={() => verifyAlert(alert)}
                    >
                      Verify
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => removeAlert(alert)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </ItemActions>
                </Item>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
