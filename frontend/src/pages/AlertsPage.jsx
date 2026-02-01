import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AlertsPage() {
  const alerts = useDashboardStore((state) => state.alerts);
  const verifyAlert = useDashboardStore((state) => state.verifyAlert);
  const removeAlert = useDashboardStore((state) => state.removeAlert);
  const updateAlertStatus = useDashboardStore(
    (state) => state.updateAlertStatus,
  );

  // Mocking solved alerts check if any in store are resolved
  // In a real app we might fetch these separately or filter from main list

  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("active");

  const allData = alerts.map((a) => ({
    ...a,
    listStatus: a.status === "RESOLVED" ? "solved" : "active",
  }));

  const filteredAlerts = allData.filter((alert) => {
    const matchesSearch =
      alert.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (currentTab === "all") return true; // Might want to exclude resolved from 'all' potentially, but let's keep all
    if (currentTab === "active") return alert.status !== "RESOLVED";
    if (currentTab === "solved") return alert.status === "RESOLVED";
    if (currentTab === "sos") return alert.status === "SOS";

    return true;
  });

  return (
    <div className="h-full flex flex-col p-8 space-y-8 bg-background text-foreground">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Alerts & Incidents
          </h2>
          <p className="text-muted-foreground">
            Manage and verify incoming distress signals from the network.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* You can add top-level actions here like "Export" */}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-full"
              />
            </div>

            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="h-9 w-full sm:w-auto"
            >
              <TabsList className="h-9 w-full sm:w-auto bg-muted/50">
                <TabsTrigger
                  value="all"
                  className="h-7 text-xs flex-1 sm:flex-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="h-7 text-xs flex-1 sm:flex-none"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="sos"
                  className="h-7 text-xs flex-1 sm:flex-none"
                >
                  SOS Only
                </TabsTrigger>
                <TabsTrigger
                  value="solved"
                  className="h-7 text-xs flex-1 sm:flex-none"
                >
                  Resolved
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 ml-auto hidden lg:flex"
          >
            <Filter className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    className="-ml-4 h-8 text-xs font-medium hover:bg-transparent"
                  >
                    Device ID
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Time Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert, idx) => (
                  <TableRow key={idx} className="group">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      {alert.deviceId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {alert.status === "SOS" ? (
                          <Badge
                            variant="destructive"
                            className="rounded-sm px-2 font-normal"
                          >
                            <ShieldAlert className="mr-1 h-3 w-3" />
                            Critical
                          </Badge>
                        ) : alert.status === "RESOLVED" ? (
                          <Badge
                            variant="outline"
                            className="rounded-sm px-2 font-normal text-muted-foreground"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Resolved
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-2 font-normal bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.location}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          alert.heartRate > 120
                            ? "text-red-500 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {alert.heartRate} BPM
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              navigator.clipboard.writeText(alert.deviceId)
                            }
                          >
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {alert.status !== "RESOLVED" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => updateAlertStatus(alert, "SOS")}
                              >
                                Mark as Critical
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateAlertStatus(alert, "RESOLVED")
                                }
                              >
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => verifyAlert(alert)}>
                            Verify Signal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => removeAlert(alert)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete Alert
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
