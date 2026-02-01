import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function ParentProfile({ formData, handleChange }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <Label>Home Location (Safe Zone)</Label>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Input
            name="homeAddress"
            value={formData?.homeAddress || ""}
            onChange={handleChange}
            placeholder="Enter Home Address"
          />
        </div>
      </div>
    </div>
  );
}
