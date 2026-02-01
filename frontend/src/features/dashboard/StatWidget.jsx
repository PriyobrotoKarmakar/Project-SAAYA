import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatWidget({ title, value, icon, trend, trendUp }) {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={trendUp ? "text-emerald-500" : "text-red-500"}>
            {trend}
          </span>{" "}
          from last hour
        </p>
      </CardContent>
    </Card>
  );
}
