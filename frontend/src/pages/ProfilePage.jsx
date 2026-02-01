import { useState } from "react";
// Import Auth Store instead of Dashboard Store
import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Stethoscope, User, Baby, Save } from "lucide-react";
import { toast } from "sonner";

// Import the Switcher Logic
import RoleSpecificForm from "@/features/profile/components/RoleSpecificForm";

export default function ProfilePage() {
  // Use Auth Store
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const role = useAuthStore((state) => state.role);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [loading, setLoading] = useState(false);

  // Local state for form editing, initialized with profile data
  const [formData, setFormData] = useState(profile || {});

  // Fallback for safety
  const safeProfile = profile || {
    name: "Loading...",
    email: user?.email,
    role: "guest",
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile Updated", {
        description: `Information for ${role} role saved successfully.`,
      });
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to update profile", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 bg-background text-foreground overflow-y-auto">
      {/* Header & Role Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and role-specific settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="capitalize">
            {role || "Guest"} View
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Identity Card (Static for everyone) */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 relative mb-4">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback>
                  {safeProfile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full ring-4 ring-background">
                {role === "police" && <Shield className="h-4 w-4" />}
                {role === "doctor" && <Stethoscope className="h-4 w-4" />}
                {role === "female" && <User className="h-4 w-4" />}
                {role === "parent" && <Baby className="h-4 w-4" />}
              </div>
            </div>
            <CardTitle>{safeProfile.name || "User Name"}</CardTitle>
            <CardDescription className="capitalize">
              {role} Account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={formData.name || safeProfile.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <span className="text-xs text-muted-foreground">
              ID: #{user?.uid?.slice(0, 8).toUpperCase()}
            </span>
            <Badge
              variant="outline"
              className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
            >
              Verified
            </Badge>
          </CardFooter>
        </Card>

        {/* RIGHT COLUMN: Dynamic Role Forms */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Role Specifications</CardTitle>
            <CardDescription>
              Fields required for your specific designation in Project Saaya.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* The Magic Component that switches content */}
            <RoleSpecificForm
              role={role}
              formData={formData}
              handleChange={handleChange}
            />
          </CardContent>

          <CardFooter className="border-t bg-muted/20 p-6 flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
