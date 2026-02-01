import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-emerald-500 gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-mono animate-pulse">
          Establishing Secure Connection...
        </p>
      </div>
    );
  }

  // Check for both User AND Role (Profile)
  // If user exists but role is null, it means profile hasn't loaded or doesn't exist.
  // Since we have a 'loading' state, we can be strict here.
  if (
    !user ||
    (!location.pathname.includes("/login") && !useAuthStore.getState().role)
  ) {
    // Redirect to login but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
