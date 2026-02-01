import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Phone, Stethoscope } from "lucide-react";

export default function FemaleProfile({ formData, handleChange }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <Label>Emergency Contact 1</Label>
        <Input
          name="emergencyContact1"
          value={formData?.emergencyContact1 || ""}
          onChange={handleChange}
          placeholder="Name & Relation"
        />
      </div>
      <div className="space-y-2">
        <Label>Emergency Contact 2</Label>
        <Input
          name="emergencyContact2"
          value={formData?.emergencyContact2 || ""}
          onChange={handleChange}
          placeholder="Name & Relation"
        />
      </div>
      <div className="space-y-2">
        <Label>Work / Home Address</Label>
        <Input
          name="address"
          value={formData?.address || ""}
          onChange={handleChange}
          placeholder="For safer route recommendations"
        />
      </div>

      <Separator className="my-2" />
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Stethoscope className="h-4 w-4" /> Medical Info (Private)
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Blood Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="o+">O+</SelectItem>
              <SelectItem value="a+">A+</SelectItem>
              <SelectItem value="b+">B+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Known Allergies</Label>
          <Input placeholder="e.g. Penicillin" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Safe Phrases (Voice Activation)</Label>
        <Input placeholder="e.g. 'Saaya Help Me'" />
        <p className="text-[10px] text-muted-foreground">
          This phrase triggers SOS when spoken loudly.
        </p>
      </div>
    </div>
  );
}
