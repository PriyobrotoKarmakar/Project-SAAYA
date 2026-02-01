import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function DoctorProfile({ formData, handleChange }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Medical License Number</Label>
          <Input
            name="licenseNumber"
            value={formData?.licenseNumber || ""}
            onChange={handleChange}
            placeholder="e.g. MCI-12345"
          />
        </div>
        <div className="space-y-2">
          <Label>Specialization</Label>
          <Input
            name="specialization"
            value={formData?.specialization || ""}
            onChange={handleChange}
            placeholder="e.g. Cardiologist"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Hospital / Clinic</Label>
        <Input
          name="hospital"
          value={formData?.hospital || ""}
          onChange={handleChange}
          placeholder="e.g. AIIMS Delhi"
        />
      </div>
      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            name="availabilityStart"
            value={formData?.availabilityStart || "09:00"}
            onChange={handleChange}
          />
          <Input
            type="time"
            name="availabilityEnd"
            value={formData?.availabilityEnd || "17:00"}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
