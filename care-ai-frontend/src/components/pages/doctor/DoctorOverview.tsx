import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Calendar, Clock, ArrowUpRight, 
  CheckCircle2, AlertCircle, TrendingUp, Activity
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function DoctorOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
     totalAppointments: 0,
     pendingAppointments: 0,
     completedToday: 0,
     totalEarnings: "₦0.00"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/care/doctor-appointments");
        const appointments = response.data;
        
        const pending = appointments.filter((a: any) => a.status === "pending").length;
        const confirmed = appointments.filter((a: any) => a.status === "confirmed").length;
        const earnings = appointments.reduce((sum: number, a: any) => sum + (a.payment_status === "paid" ? (a.amount / 100) : 0), 0);

        setStats({
           totalAppointments: appointments.length,
           pendingAppointments: pending,
           completedToday: confirmed, // Using confirmed as active/done for this simple demo
           totalEarnings: `₦${earnings.toLocaleString()}`
        });
      } catch (e) {
        console.error("Failed to load doctor stats");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Appointments", value: stats.totalAppointments, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending Request", value: stats.pendingAppointments, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Active Sessions", value: stats.completedToday, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Revenue", value: stats.totalEarnings, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Physician Dashboard</h1>
        <p className="text-slate-500 font-medium tracking-tight uppercase text-[11px] font-black">Welcome back, {user?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +12%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.title}</p>
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 rounded-2xl border-slate-100 shadow-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-slate-900">Upcoming Consultations</h3>
               <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-4">
               {stats.totalAppointments === 0 ? (
                 <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">No appointments scheduled for today.</p>
                 </div>
               ) : (
                 <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between group cursor-pointer hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg transform group-hover:scale-110 transition-transform">
                          PA
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Patient Alpha (Sample)</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Video Consult — 10:30 AM Today</p>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg">Launch</button>
                    </div>
                 </div>
               )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary/40 opacity-50" />
          <CardContent className="p-8 relative">
            <h3 className="text-lg font-bold mb-4">Practice Analytics</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium">Your patient retention is up by <span className="text-white font-bold">18%</span> compared to last month.</p>
            <div className="space-y-4">
               {[
                 { label: "Punctuality", val: "98%" },
                 { label: "Satisfaction", val: "4.9/5" },
                 { label: "Completion", val: "100%" }
               ].map((item, i) => (
                 <div key={i}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                       <span>{item.label}</span>
                       <span>{item.val}</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: item.val === "100%" || item.val === "98%" ? "98%" : "90%" }} />
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">View Full Report</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
