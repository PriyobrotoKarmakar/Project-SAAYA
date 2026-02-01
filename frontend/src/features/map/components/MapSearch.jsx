import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function MapSearch({ map, alerts, stations }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const lowerTerm = searchTerm.toLowerCase();

    const foundAlert = alerts.find(
      (a) =>
        a.deviceId.toLowerCase().includes(lowerTerm) ||
        a.location.toLowerCase().includes(lowerTerm),
    );

    const foundStation = stations.find(
      (s) =>
        s.name.toLowerCase().includes(lowerTerm) ||
        s.city.toLowerCase().includes(lowerTerm),
    );

    if (foundAlert?.coordinates) map?.setView(foundAlert.coordinates, 15);
    else if (foundStation?.coordinates)
      map?.setView(foundStation.coordinates, 15);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <InputGroup className="bg-background border-border shadow-md dark:bg-card">
        <InputGroupAddon>
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search ID, City..."
          className="pl-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <InputGroupAddon>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </form>
  );
}
