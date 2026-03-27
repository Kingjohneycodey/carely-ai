import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Stethoscope, Camera, MessageCircle, AlertTriangle, Upload, 
  Pill, Activity, TrendingUp, ChevronRight, Bell, Heart,
  ShieldCheck, ArrowUpRight, Target, Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: Stethoscope, label: "Check Symptoms", to: "/symptoms", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: MessageCircle, label: "Consult Doctor", to: "/doctors", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Activity, label: "Track Vitals", to: "/vitals", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Camera, label: "Image Diagnosis", to: "/image-diagnosis", color: "text-amber-600", bg: "bg-amber-50" },
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500 font-sans">
      {/* Modern Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
             Welcome back, {user?.full_name?.split(' ')[0] || "User"}
           </h1>
           <p className="text-slate-500 mt-1">Here is a summary of your health activity today.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-lg h-10 gap-2">
              <Bell className="h-4 w-4" /> Notifications
           </Button>
           <Button className="rounded-lg h-10 gap-2 bg-slate-900">
              <PlusIcon className="h-4 w-4" /> New Record
           </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((a) => (
          <Link key={a.label} href={a.to}>
            <Card className="hover:border-primary/50 transition-all cursor-pointer shadow-sm group border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", a.bg)}>
                  <a.icon className={cn("h-6 w-6", a.color)} />
                </div>
                <span className="font-semibold text-sm text-slate-700">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Health Insights */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-slate-200">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                       <Activity className="h-4 w-4 text-primary" /> Recent Vitals
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    {isLoading ? (
                      <div className="h-24 bg-slate-50 animate-pulse rounded-lg" />
                    ) : vitals.length > 0 ? (
                       <div className="space-y-4 pt-2">
                         {vitals.slice(0, 3).map((v, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                               <span className="text-slate-500 font-medium uppercase text-[10px] tracking-wider">{v.type.replace('_', ' ')}</span>
                               <span className="font-bold text-slate-900">{v.value} {v.unit}</span>
                            </div>
                         ))}
                       </div>
                    ) : (
                       <p className="text-sm text-slate-400 py-4 text-center">No vitals tracked recently.</p>
                    )}
                 </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                       <FileText className="h-4 w-4 text-primary" /> Reports Status
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4 pt-2">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Synced Records</span>
                          <span className="font-bold">{records.length}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">AI Confidence</span>
                          <span className="font-bold text-emerald-600">92%</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* History Feed */}
           <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                 <CardTitle className="text-lg font-bold">Health History</CardTitle>
                 <Link href="/records">
                    <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                 </Link>
              </CardHeader>
              <CardContent className="space-y-1">
                 {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-lg mb-3" />)
                 ) : records.length > 0 ? (
                    records.slice(0, 5).map((r, i) => (
                       <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer group">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                             <FileText className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-bold text-slate-900 truncate">{r.title}</p>
                             <p className="text-xs text-slate-400 font-medium">{r.type} • {new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300" />
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center">
                       <p className="text-slate-400 text-sm">Your health timeline starts here.</p>
                       <Button variant="link" className="text-primary" asChild><Link href="/upload">Upload your first report</Link></Button>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Sidebar/Context Cards */}
        <div className="space-y-6">
           <Card className="bg-slate-900 text-white border-none shadow-lg rounded-2xl">
              <CardContent className="p-6 space-y-4">
                 <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">Health Score</h3>
                    <p className="text-white/60 text-sm">Your overall wellness index based on 30-day trends.</p>
                 </div>
                 <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">82</span>
                    <span className="text-white/40 text-sm font-bold mb-1 uppercase tracking-widest">/ 100</span>
                 </div>
                 <Progress value={82} className="h-2 bg-white/10" />
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Status</p>
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <div>
                       <p className="text-sm font-bold">Data Encrypted</p>
                       <p className="text-[10px] text-slate-400">End-to-end health data protection</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-sm mb-2">Did you know?</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                Drinking at least 2 liters of water daily in warm climates like Nigeria can significantly improve your vital consistency.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
