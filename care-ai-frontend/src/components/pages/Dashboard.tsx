import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Stethoscope, Camera, MessageCircle, AlertTriangle, Upload,
  Pill, Activity, TrendingUp, ChevronRight, Bell, Heart
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  { icon: Stethoscope, label: "Check Symptoms", to: "/symptoms", color: "bg-primary/10 text-primary" },
  { icon: MessageCircle, label: "Chat Doctor", to: "/doctors", color: "bg-success/10 text-success" },
  { icon: AlertTriangle, label: "Emergency", to: "/emergency", color: "bg-emergency/10 text-emergency" },
  { icon: Upload, label: "Upload Lab", to: "/upload", color: "bg-warning/10 text-warning" },
];

const recentActivity = [
  { type: "symptom", title: "Headache & Fever Check", time: "2 hours ago", severity: "moderate" },
  { type: "consult", title: "Dr. Adeyemi — Follow-up", time: "Yesterday", severity: "low" },
  { type: "lab", title: "Blood Test Results", time: "3 days ago", severity: "low" },
  { type: "medication", title: "Prescription Refill Due", time: "5 days ago", severity: "info" },
];

const medications = [
  { name: "Metformin 500mg", time: "8:00 AM", taken: true },
  { name: "Amlodipine 5mg", time: "8:00 AM", taken: true },
  { name: "Vitamin D3", time: "2:00 PM", taken: false },
  { name: "Metformin 500mg", time: "8:00 PM", taken: false },
];

const severityColor: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning border-warning/20",
  high: "bg-emergency/10 text-emergency border-emergency/20",
  info: "bg-accent text-accent-foreground border-accent",
};

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Good morning, Adebayo 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link key={a.label} href={a.to}>
            <Card className="hover:shadow-card transition-shadow cursor-pointer border-border hover:border-primary/20">
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${a.color}`}>
                  <a.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Health Score</h3>
              <Badge variant="secondary" className="text-xs">Updated today</Badge>
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="relative h-36 w-36">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                    strokeDasharray={`${78 * 3.14} ${100 * 3.14}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold">78</span>
                  <span className="text-xs text-muted-foreground">Good</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Activity</span><span className="font-medium">85%</span></div>
              <Progress value={85} className="h-1.5" />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Vitals</span><span className="font-medium">72%</span></div>
              <Progress value={72} className="h-1.5" />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Compliance</span><span className="font-medium">90%</span></div>
              <Progress value={90} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Recent Activity</h3>
              <Link href="/wallet" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    {item.type === "symptom" && <Stethoscope className="h-5 w-5 text-primary" />}
                    {item.type === "consult" && <MessageCircle className="h-5 w-5 text-success" />}
                    {item.type === "lab" && <Activity className="h-5 w-5 text-primary" />}
                    {item.type === "medication" && <Pill className="h-5 w-5 text-warning" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${severityColor[item.severity]}`}>
                    {item.severity}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Reminders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Today's Medications</h3>
            <span className="text-sm text-muted-foreground">2 of 4 taken</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {medications.map((med, i) => (
              <div key={i} className={`rounded-xl border p-4 ${med.taken ? "bg-success/5 border-success/20" : "border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <Pill className={`h-4 w-4 ${med.taken ? "text-success" : "text-muted-foreground"}`} />
                  <span className="text-xs text-muted-foreground">{med.time}</span>
                </div>
                <p className="text-sm font-medium mb-3">{med.name}</p>
                {med.taken ? (
                  <Badge variant="secondary" className="bg-success/10 text-success border-0 text-xs">✓ Taken</Badge>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-xs w-full">Mark Taken</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
