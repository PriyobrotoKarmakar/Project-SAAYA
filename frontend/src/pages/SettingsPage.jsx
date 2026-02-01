import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Shield,
  Map as MapIcon,
  Database,
  Save,
  Moon,
  Sun,
  Laptop,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTheme } from "@/components/theme-provider";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const settings = useSettingsStore();
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const handleSave = () => {
    setLoading(true);
    // In a real app, you might sync to backend here.
    // Since we use persist middleware, it's already in localStorage.
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated.",
      });
    }, 800);
  };

  const handleClearCache = () => {
    const confirm = window.confirm(
      "Are you sure? This will reset all local data.",
    );
    if (confirm) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 bg-background text-foreground overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your dashboard preferences and system configurations.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Map</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* 1. GENERAL TAB */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the dashboard looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${theme === "dark" ? "border-primary bg-accent/50" : ""}`}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${theme === "light" ? "border-primary bg-accent/50" : ""}`}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${theme === "system" ? "border-primary bg-accent/50" : ""}`}
                  >
                    <Laptop className="h-6 w-6" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Performance</CardTitle>
              <CardDescription>
                Manage data fetching intervals and performance settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Data Refresh Rate (Seconds)</Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.refreshRate}s
                  </span>
                </div>
                <Slider
                  value={[settings.refreshRate]}
                  onValueChange={(val) => updateSetting("refreshRate", val[0])}
                  max={60}
                  step={5}
                  min={5}
                  className="w-[60%]"
                />
                <p className="text-[10.5px] text-muted-foreground">
                  Lower values update data faster but may increase server load.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. ALERTS & MAP TAB */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>
                Define thresholds for automatic system alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="hr-threshold">
                    Critical Heart Rate (BPM)
                  </Label>
                  <Input
                    id="hr-threshold"
                    type="number"
                    value={settings.criticalHr}
                    onChange={(e) =>
                      updateSetting("criticalHr", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="radius">Search Radius (km)</Label>
                  <Input
                    id="radius"
                    type="number"
                    value={settings.searchRadius}
                    onChange={(e) =>
                      updateSetting(
                        "searchRadius",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label className="text-base">Sound Alerts</Label>
                  <span className="text-sm text-muted-foreground">
                    Play a siren sound when an SOS signal is received.
                  </span>
                </div>
                <Switch
                  checked={settings.soundAlerts}
                  onCheckedChange={(checked) =>
                    updateSetting("soundAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label className="text-base">Auto-Verify Routes</Label>
                  <span className="text-sm text-muted-foreground">
                    Automatically calculate nearest police station on new alert.
                  </span>
                </div>
                <Switch
                  checked={settings.autoVerify}
                  onCheckedChange={(checked) =>
                    updateSetting("autoVerify", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map Settings</CardTitle>
              <CardDescription>
                Configure the default view for the live map.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-sm">
                <Label>Default Region</Label>
                <Select
                  value={settings.defaultRegion}
                  onValueChange={(val) => updateSetting("defaultRegion", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Choose how you want to be notified of critical events.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label className="text-base">Email Digests</Label>
                  <span className="text-sm text-muted-foreground">
                    Receive a daily summary of resolved alerts.
                  </span>
                </div>
                <Switch
                  checked={settings.emailDigest}
                  onCheckedChange={(checked) =>
                    updateSetting("emailDigest", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label className="text-base">SMS / WhatsApp</Label>
                  <span className="text-sm text-muted-foreground">
                    Forward critical SOS alerts to registered field numbers.
                  </span>
                </div>
                <Switch
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) =>
                    updateSetting("smsAlerts", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. SYSTEM TAB */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage logs and data retention policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-sm">
                <Label>Retention Period</Label>
                <Select
                  value={settings.retentionPeriod}
                  onValueChange={(val) => updateSetting("retentionPeriod", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  Resolved alerts older than this will be archived.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10"
                  onClick={handleClearCache}
                >
                  Clear System Cache
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t border-border px-6 py-3">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Shield className="h-3 w-3" />
                System Version: v1.2.4 (Stable)
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
