import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function MapLayers({ layers, setLayers }) {
  const toggleLayer = (key, checked) => {
    setLayers((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <Card className="p-3 bg-background/90 border-border shadow-md space-y-3 w-[200px]">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="layer-police"
          checked={layers.police}
          onCheckedChange={(c) => toggleLayer("police", c)}
        />
        <Label
          htmlFor="layer-police"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Police Stations
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="layer-routes"
          checked={layers.routes}
          onCheckedChange={(c) => toggleLayer("routes", c)}
        />
        <Label
          htmlFor="layer-routes"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Routes
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="layer-alerts"
          checked={layers.alerts}
          onCheckedChange={(c) => toggleLayer("alerts", c)}
        />
        <Label
          htmlFor="layer-alerts"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nodes (Alerts)
        </Label>
      </div>
    </Card>
  );
}
