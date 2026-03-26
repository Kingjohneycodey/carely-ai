import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Download, Share2, FileText, Stethoscope, Pill, TestTube, ChevronRight } from "lucide-react";

const timeline = [
  {
    date: "Today", items: [
      { type: "symptom", title: "Headache & Fever Assessment", badge: "Moderate", time: "10:30 AM" },
    ]
  },
  {
    date: "Yesterday", items: [
      { type: "consult", title: "Teleconsultation — Dr. Adeyemi", badge: "Completed", time: "3:00 PM" },
      { type: "prescription", title: "Prescription: Antimalarial course", badge: "Active", time: "3:30 PM" },
    ]
  },
  {
    date: "Last Week", items: [
      { type: "lab", title: "Complete Blood Count Results", badge: "Normal", time: "Mon" },
      { type: "vitals", title: "Blood Pressure Log: 128/82", badge: "Elevated", time: "Tue" },
    ]
  },
];

const typeIcon: Record<string, React.ReactNode> = {
  symptom: <Stethoscope className="h-4 w-4 text-primary" />,
  consult: <FileText className="h-4 w-4 text-success" />,
  prescription: <Pill className="h-4 w-4 text-warning" />,
  lab: <TestTube className="h-4 w-4 text-primary" />,
  vitals: <Activity className="h-4 w-4 text-emergency" />,
};

export default function HealthWallet() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Health Wallet</h1>
          <p className="text-muted-foreground text-sm">Your complete health timeline and records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
        </div>
      </div>

      {/* Vitals Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Blood Pressure", value: "128/82", unit: "mmHg", trend: "up", status: "Elevated" },
          { label: "Weight", value: "78.5", unit: "kg", trend: "stable", status: "Normal" },
          { label: "Blood Glucose", value: "95", unit: "mg/dL", trend: "down", status: "Normal" },
          { label: "Temperature", value: "37.2", unit: "°C", trend: "stable", status: "Normal" },
        ].map(v => (
          <Card key={v.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{v.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-xl font-bold">{v.value}</span>
                <span className="text-xs text-muted-foreground">{v.unit}</span>
              </div>
              <Badge variant="outline" className="text-[10px] mt-2">{v.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Score Trend */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Health Score Trend</h3>
            <div className="flex gap-2">
              {["1M", "3M", "6M", "1Y"].map(p => (
                <button key={p} className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 bg-muted/30 rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Health score chart — +5 points this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Health Timeline</h3>
          <div className="space-y-6">
            {timeline.map(group => (
              <div key={group.date}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group.date}</p>
                <div className="space-y-2">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        {typeIcon[item.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{item.badge}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
