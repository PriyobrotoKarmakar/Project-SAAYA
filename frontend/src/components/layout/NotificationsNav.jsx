import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardStore } from "@/store/useDashboardStore";

export function NotificationsNav() {
  const alerts = useDashboardStore((state) => state.alerts);
  const activeAlerts = alerts.filter((a) => a.status === "SOS");
  const hasAlerts = activeAlerts.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasAlerts && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          Notifications ({activeAlerts.length})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {activeAlerts.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No active alerts
            </div>
          ) : (
            activeAlerts.map((alert, index) => (
              <DropdownMenuItem
                key={`${alert.deviceId}-${index}`}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-red-500">
                      SOS: {alert.deviceId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Location: {alert.location}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    HR: {alert.heartRate} BPM
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {hasAlerts && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="outline" className="w-full h-8 text-xs">
                View All Alerts
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
