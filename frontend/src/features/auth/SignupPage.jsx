import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
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
import { Shield, Loader2, Stethoscope, User, Baby } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const [role, setRole] = useState("female"); // Default role
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Role specific fields
    badgeNumber: "", // Was badgeId
    station: "", // Was stationId
    licenseNumber: "", // Was licenseId
    hospital: "", // Was hospitalName
    childDeviceId: "",
    emergencyContact1: "", // Map to primary contact
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We pass all data, the store will filter what to save based on role
      await signup(
        formData.email,
        formData.password,
        role,
        formData.name,
        formData,
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* ... Left Side omitted for brevity ... */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src="/favicon.png"
            alt="Saaya Logo"
            className="mr-2 h-6 w-6 text-emerald-500"
          />
          Project Saaya
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Join the network that powers rapid response. Whether you
              are a guardian, a responder, or a citizen, your participation
              makes the city safer.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: Dynamic Signup Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Select your role to get started.
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {/* 1. ROLE SELECTOR */}
                <div className="grid gap-2">
                  <Label>I am a...</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Citizen / Female User
                        </div>
                      </SelectItem>
                      <SelectItem value="police">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Police Officer
                        </div>
                      </SelectItem>
                      <SelectItem value="doctor">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" /> Medical
                          Professional
                        </div>
                      </SelectItem>
                      <SelectItem value="parent">
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4" /> Parent / Guardian
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. COMMON FIELDS */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    disabled={loading}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={loading}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={loading}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* 3. DYNAMIC FIELDS */}

                {/* Police Specific */}
                {role === "police" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                      <Label htmlFor="badgeNumber">Badge Number</Label>
                      <Input
                        id="badgeNumber"
                        placeholder="DL-POL-XXXX"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="station">Station Assignment</Label>
                      <Input
                        id="station"
                        placeholder="Station Name/ID"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* Doctor Specific */}
                {role === "doctor" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                      <Label htmlFor="licenseNumber">Medical License ID</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="MCI-XXXX-XXXX"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hospital">Hospital Affiliation</Label>
                      <Input
                        id="hospital"
                        placeholder="Hospital Name"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* Parent Specific */}
                {role === "parent" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                      <Label htmlFor="childDeviceId">Child's Device ID</Label>
                      <Input
                        id="childDeviceId"
                        placeholder="Saaya_Device_ID"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* Female User Specific */}
                {role === "female" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-2">
                      <Label htmlFor="emergencyContact1">
                        Emergency Contact (Primary)
                      </Label>
                      <Input
                        id="emergencyContact1"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <Button
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-emerald-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
