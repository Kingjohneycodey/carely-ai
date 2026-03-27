import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, Video, MoreVertical, Search, Filter, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/care/doctor-appointments");
        setAppointments(response.data);
      } catch (e) {
        toast.error("Failed to load your appointments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-100 text-emerald-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500 font-medium">Review and update your patient consultation schedule.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              <input 
                placeholder="Search patient..." 
                className="pl-10 pr-4 h-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium w-full md:w-64 focus:bg-white focus:shadow-md transition-all outline-none"
              />
           </div>
           <Button variant="outline" className="h-11 w-11 rounded-xl p-0 border-slate-200 text-slate-500"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-slate-300">Loading your schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="py-32 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No patient bookings found.</p>
          </div>
        ) : (
          appointments.map((a, i) => (
            <Card key={i} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                       {a.user_id ? "PA" : "PT"}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h3 className="font-bold text-slate-900 text-lg">Patient #{a.user_id}</h3>
                         <Badge className={cn("px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border-none shrink-0", getStatusColor(a.status))}>
                           {a.status}
                         </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {a.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" /> {a.time}</span>
                        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> {a.payment_status === "paid" ? "PAID — ₦" + (a.amount/100).toLocaleString() : "UNPAID"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"><XCircle className="h-4 w-4 mr-2" /> Cancel</Button>
                    <Button className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"><Video className="h-4 w-4 mr-2" /> Start Session</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
