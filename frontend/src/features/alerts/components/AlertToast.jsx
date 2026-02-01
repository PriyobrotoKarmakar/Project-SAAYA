import { Shield, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

export const AlertToast = ({ alert, onClose }) => {
  const isSOS = alert.status === "SOS";

  return (
    <div
      className={`
      w-full flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl
      ${
        isSOS
          ? "bg-red-950/90 border-red-500/50 text-red-100"
          : "bg-gray-900/90 border-white/10 text-white"
      }
    `}
    >
      <div
        className={`
        p-2 rounded-full shrink-0
        ${isSOS ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}
      `}
      >
        {isSOS ? (
          <AlertTriangle className="h-5 w-5 animate-pulse" />
        ) : (
          <Shield className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm uppercase tracking-wider font-rajdhani">
          {isSOS ? "Critical SOS Alert" : "New System Alert"}
        </h4>
        <p className="text-xs opacity-80 truncate">
          Device: <span className="font-mono">{alert.deviceId}</span>
        </p>
        <p className="text-[10px] opacity-60 mt-0.5">{alert.location}</p>
      </div>

      <button
        onClick={() => toast.dismiss(onClose)}
        className="p-1 hover:bg-white/10 rounded-md transition-colors"
      >
        <X className="h-4 w-4 opacity-70" />
      </button>
    </div>
  );
};
