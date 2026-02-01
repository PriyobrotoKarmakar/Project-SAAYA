import StatWidget from "./StatWidget";
import { ShieldAlert, Activity, Users, Radio } from "lucide-react";

export default function StatsGrid({ count = 0 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatWidget
        title="Active SOS"
        value={count}
        icon={ShieldAlert}
        trend={count > 0 ? "+CRITICAL" : "Normal"}
        trendUp={count === 0}
      />
      <StatWidget
        title="Active Nodes"
        value="573"
        icon={Users}
        trend="+12"
        trendUp={true}
      />
      <StatWidget
        title="Avg Response Time"
        value="98.2%"
        icon={Radio}
        trend="+0.1%"
        trendUp={true}
      />
      <StatWidget
        title="System Load"
        value="24%"
        icon={Activity}
        trend="-4%"
        trendUp={true}
      />
    </div>
  );
}
