import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Plus, Droplets, Weight, Thermometer, Heart } from "lucide-react";

const vitals = [
  { icon: Heart, label: "Blood Pressure", value: "128/82", unit: "mmHg", status: "Slightly Elevated", trend: "+3", color: "text-warning" },
  { icon: Droplets, label: "Blood Glucose", value: "95", unit: "mg/dL", status: "Normal", trend: "-5", color: "text-success" },
  { icon: Weight, label: "Weight", value: "78.5", unit: "kg", status: "Stable", trend: "0", color: "text-primary" },
  { icon: Thermometer, label: "Temperature", value: "36.8", unit: "°C", status: "Normal", trend: "0", color: "text-success" },
];

const history = [
  { date: "Today", bp: "128/82", glucose: "95", weight: "78.5", temp: "36.8" },
  { date: "Yesterday", bp: "126/80", glucose: "98", weight: "78.5", temp: "36.6" },
  { date: "2 days ago", bp: "130/85", glucose: "102", weight: "78.8", temp: "37.1" },
  { date: "3 days ago", bp: "125/78", glucose: "92", weight: "78.6", temp: "36.7" },
];

export default function Vitals() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Vitals</h1>
          <p className="text-muted-foreground text-sm">Track and log your vital signs</p>
        </div>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4 mr-1" /> Log Vitals</Button>
      </div>

      {/* Vital Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map(v => (
          <Card key={v.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <v.icon className={`h-5 w-5 ${v.color}`} />
                <span className={`text-xs font-medium ${v.color}`}>
                  {v.trend !== "0" && (Number(v.trend) > 0 ? "↑" : "↓")} {v.trend !== "0" ? v.trend : "—"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{v.label}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-2xl font-bold">{v.value}</span>
                <span className="text-xs text-muted-foreground">{v.unit}</span>
              </div>
              <p className={`text-xs mt-1 ${v.color}`}>{v.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Trends</h3>
            <div className="flex gap-2">
              {["BP", "Glucose", "Weight", "Temp"].map((t, i) => (
                <button key={t} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 bg-muted/30 rounded-xl flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Blood pressure trend over the last 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Recent Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">BP</th>
                  <th className="pb-2 font-medium">Glucose</th>
                  <th className="pb-2 font-medium">Weight</th>
                  <th className="pb-2 font-medium">Temp</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-muted-foreground">{h.date}</td>
                    <td className="py-3 font-medium">{h.bp}</td>
                    <td className="py-3">{h.glucose}</td>
                    <td className="py-3">{h.weight}</td>
                    <td className="py-3">{h.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
