import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Stethoscope, Camera, MessageCircle, AlertTriangle, Upload, 
  Pill, Activity, TrendingUp, ChevronRight, Bell, Heart,
  ShieldCheck, ArrowUpRight, Zap, Target, Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: Stethoscope, label: "Check Symptoms", to: "/symptoms", color: "bg-primary/10 text-primary" },
  { icon: MessageCircle, label: "Chat Doctor", to: "/doctors", color: "bg-success/10 text-success" },
  { icon: Activity, label: "Track Vitals", to: "/vitals", color: "bg-indigo-50 text-indigo-600" },
  { icon: Upload, label: "AI Smart Scan", to: "/upload", color: "bg-warning/10 text-warning" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [vResponse, rResponse] = await Promise.all([
          api.get("/health/vitals"),
          api.get("/health/records")
        ]);
        setVitals(vResponse.data);
        setRecords(rResponse.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLatestVital = (type: string) => {
    return vitals.find(v => v.type === type);
  };

  return (
    <div className="space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Greeting Hero */}
      <div className="relative overflow-hidden bg-card rounded-[40px] border border-primary/5 shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
           <Zap className="h-64 w-64 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                 <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px]">Premium Member</Badge>
                 <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px]">Lagos, NG</Badge>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Good day, <span className="text-primary">{user?.full_name?.split(' ')[0] || "Adebayo"}</span> 👋
              </h1>
              <p className="text-muted-foreground text-lg font-medium max-w-md">
                Your health ecosystem is tuned and synchronized. 
                <span className="text-foreground font-bold"> Everything looks stable today.</span>
              </p>
           </div>
           <div className="flex flex-col gap-3 shrink-0">
             <div className="flex items-center gap-4 p-5 bg-muted/20 backdrop-blur-xl rounded-3xl border border-white shadow-inner">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                   <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Security</p>
                   <p className="text-sm font-bold">Encrypted & Verified</p>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((a) => (
          <Link key={a.label} href={a.to}>
            <Card className="rounded-[32px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-none shadow-xl group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-5">
                <div className={cn("h-20 w-20 rounded-[28px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", a.color)}>
                  <a.icon className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                   <span className="text-base font-bold block">{a.label}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">Launch Service</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Real-time Health Monitor */}
        <Card className="lg:col-span-1 rounded-[40px] border-none shadow-2xl bg-card overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-display text-2xl font-bold">Health Score</h3>
              <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
                 <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center py-6 mb-10">
              <div className="relative h-48 w-48">
                <svg className="h-48 w-48 -rotate-90 drop-shadow-2xl" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted)/0.2)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                    strokeDasharray={`${82 * 3.4} ${100 * 3.4}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500 delay-500">
                  <span className="font-display text-5xl font-black text-primary">82</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Optimal</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border/50">
              {[
                { label: "Vitals Consistency", val: 85, color: "bg-blue-500" },
                { label: "Medical Compliance", val: 94, color: "bg-emerald-500" },
                { label: "AI Insights Utilized", val: 72, color: "bg-amber-500" }
              ].map(stat => (
                <div key={stat.label} className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="text-foreground">{stat.val}%</span>
                  </div>
                  <Progress value={stat.val} className="h-2 rounded-full bg-muted/20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Activity Feed */}
        <Card className="lg:col-span-2 rounded-[40px] border-none shadow-2xl bg-white overflow-hidden">
          <CardContent className="p-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <HistoryIcon />
                 </div>
                 <h3 className="font-display text-2xl font-bold">Recent History</h3>
              </div>
              <Link href="/records" className="text-sm font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-xl transition-all flex items-center gap-1">
                View Wallet <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex-1 space-y-4">
              {isLoading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 w-full bg-muted shadow-inner rounded-3xl animate-pulse" />
                ))
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                   <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
                   </div>
                   <p className="font-bold text-lg">No records found yet.</p>
                   <p className="text-sm max-w-xs">Upload your first lab result to get personalized AI insights.</p>
                </div>
              ) : (
                records.slice(0, 4).map((item, i) => (
                  <div key={i} className="group flex items-center gap-5 p-5 rounded-[28px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      {item.type === "Diagnosis" && <Stethoscope className="h-6 w-6 text-rose-500" />}
                      {item.type === "Lab Report" && <Activity className="h-6 w-6 text-blue-500" />}
                      {item.type === "Prescription" && <Pill className="h-6 w-6 text-amber-500" />}
                      {!["Diagnosis", "Lab Report", "Prescription"].includes(item.type) && <FileText className="h-6 w-6 text-slate-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{item.type}</span>
                         <div className="w-1 h-1 bg-border rounded-full" />
                         <span className="text-xs font-semibold text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 p-6 bg-primary/5 rounded-[32px] border border-primary/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                     <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">New Notification</p>
                    <p className="text-xs text-muted-foreground">Your 3-month fasting glucose trend is ready.</p>
                  </div>
               </div>
               <Button variant="ghost" className="rounded-xl font-bold text-primary">View</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

