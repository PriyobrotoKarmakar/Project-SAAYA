import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PoliceProfile({ formData, handleChange }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Badge Number</Label>
          <Input
            name="badgeNumber"
            value={formData?.badgeNumber || ""}
            onChange={handleChange}
            placeholder="e.g. DL-POL-1234"
          />
        </div>
        <div className="space-y-2">
          <Label>Rank / Designation</Label>
          <Select
            value={formData?.rank || "inspector"}
            onValueChange={(value) =>
              handleChange({ target: { name: "rank", value } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="constable">Constable</SelectItem>
              <SelectItem value="inspector">Inspector</SelectItem>
              <SelectItem value="commissioner">Commissioner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Station Jurisdiction</Label>
        <Input
          name="station"
          value={formData?.station || ""}
          onChange={handleChange}
          placeholder="e.g. Connaught Place"
        />
      </div>
      <div className="space-y-2">
        <Label>Shift Timings</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            name="shiftStart"
            value={formData?.shiftStart || "08:00"}
            onChange={handleChange}
          />
          <Input
            type="time"
            name="shiftEnd"
            value={formData?.shiftEnd || "20:00"}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
