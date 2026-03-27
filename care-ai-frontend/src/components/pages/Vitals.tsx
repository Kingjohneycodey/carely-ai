import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, TrendingUp, Plus, Droplets, Weight, 
  Thermometer, Heart, Loader2, Calendar, Clock,
  ChevronRight, AlertCircle, CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Vital = {
  id: number;
  type: string;
  value: string;
  unit: string;
  recorded_at: string;
};

const VITAL_TYPES = [
  { id: "blood_pressure", label: "Blood Pressure", icon: Heart, unit: "mmHg", color: "text-red-500", bgColor: "bg-red-50" },
  { id: "heart_rate", label: "Heart Rate", icon: Activity, unit: "bpm", color: "text-rose-500", bgColor: "bg-rose-50" },
  { id: "blood_glucose", label: "Blood Glucose", icon: Droplets, unit: "mg/dL", color: "text-blue-500", bgColor: "bg-blue-50" },
  { id: "weight", label: "Weight", icon: Weight, unit: "kg", color: "text-indigo-500", bgColor: "bg-indigo-50" },
  { id: "temperature", label: "Temperature", icon: Thermometer, unit: "°C", color: "text-orange-500", bgColor: "bg-orange-50" },
];

export default function Vitals() {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  
  // Form State
  const [newType, setNewType] = useState(VITAL_TYPES[0].id);
  const [newValue, setNewValue] = useState("");

  const fetchVitals = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/health/vitals");
      setVitals(response.data);
    } catch (error) {
      toast.error("Failed to fetch vitals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const handleLogVital = async () => {
    if (!newValue.trim()) return;
    try {
      setIsLogging(true);
      const typeInfo = VITAL_TYPES.find(t => t.id === newType);
      await api.post("/health/vitals", {
        type: newType,
        value: newValue,
        unit: typeInfo?.unit || ""
      });
      toast.success("Vital logged successfully");
      setShowLogModal(false);
      setNewValue("");
      fetchVitals();
    } catch (error) {
      toast.error("Failed to log vital");
    } finally {
      setIsLogging(false);
    }
  };

  // Get most recent vital for each type
  const latestVitals = VITAL_TYPES.map(type => {
    const latest = vitals.find(v => v.type === type.id);
    return { ...type, ...latest };
  });

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-card p-6 rounded-3xl border border-primary/5 shadow-sm">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Health Vitals</h1>
          <p className="text-muted-foreground text-sm font-medium">Keep a real-time pulse on your essential health metrics</p>
        </div>
        <Button 
          onClick={() => setShowLogModal(true)}
          className="rounded-2xl gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Vital Log
        </Button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {latestVitals.map((v, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-5">
              <div className={cn("inline-flex p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110", v.bgColor)}>
                <v.icon className={cn("h-6 w-6", v.color)} />
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">{v.label}</h3>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-display font-bold">
                  {v.value || "—"}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase">{v.unit}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className={cn(
                  "h-1.5 flex-1 rounded-full",
                  v.value ? "bg-primary/20" : "bg-muted"
                )}>
                  <div className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    v.color.replace("text", "bg"),
                    v.value ? "w-[65%]" : "w-0"
                  )} />
                </div>
                {v.value && <TrendingUp className="h-3 w-3 text-primary animate-pulse" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent History Table */}
        <Card className="lg:col-span-2 rounded-3xl border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">Historical Readings</h2>
              </div>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">
                View Full Logs <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-muted-foreground/60 text-xs font-bold uppercase tracking-widest border-b border-border/50">
                    <th className="pb-4 pl-2">Vital Type</th>
                    <th className="pb-4 text-center">Reading</th>
                    <th className="pb-4 text-right pr-4">Recorded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={3} className="py-6 bg-muted/5 rounded-2xl mb-2" />
                      </tr>
                    ))
                  ) : vitals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No readings recorded yet.</p>
                      </td>
                    </tr>
                  ) : (
                    vitals.map(v => (
                      <tr key={v.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="py-5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center bg-card shadow-sm border border-border/50",
                              VITAL_TYPES.find(t => t.id === v.type)?.color
                            )}>
                              {(() => {
                                const Icon = VITAL_TYPES.find(t => t.id === v.type)?.icon || Activity;
                                return <Icon className="h-5 w-5" />;
                              })()}
                            </div>
                            <span className="font-semibold text-[15px]">{VITAL_TYPES.find(t => t.id === v.type)?.label}</span>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="px-3 py-1.5 bg-primary/5 text-primary rounded-full font-display font-bold text-base">
                            {v.value} {v.unit}
                          </span>
                        </td>
                        <td className="py-5 text-right pr-4">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-foreground/80">{new Date(v.recorded_at).toLocaleDateString()}</span>
                            <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-tight">
                              {new Date(v.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Card / Insights */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <TrendingUp className="h-32 w-32 rotate-12" />
            </div>
            <CardContent className="p-8 relative z-10">
              <h3 className="font-display text-2xl font-bold mb-4">Health Insight</h3>
              <p className="text-primary-foreground/90 text-[15px] leading-relaxed mb-6">
                Your average blood pressure has stabilized over the last 7 days. Keep maintaining your hydration and 30m daily walks.
              </p>
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                 <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                 <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Stability</p>
                    <p className="text-sm font-semibold">94% Consistency Score</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-lg bg-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-orange-500/10 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="font-display text-xl font-bold">Suggestions</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Log weight after morning routine",
                  "BP is best recorded twice daily",
                  "Connect Apple Health / Fit"
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-1.5 w-1.5 bg-orange-500 rounded-full" />
                    </div>
                    <span className="text-sm text-foreground/70 font-medium leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Log Vital Modal (Simulation using state) */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md rounded-[32px] border-none shadow-2xl overflow-hidden scale-in-95">
            <div className="p-8 bg-gradient-to-br from-card to-muted/30">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-2xl font-bold">New Vital Reading</h2>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowLogModal(false)}>
                  <Plus className="h-5 w-5 rotate-45" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Metric Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {VITAL_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setNewType(type.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                          newType === type.id 
                            ? "bg-primary/5 border-primary text-primary" 
                            : "bg-background border-transparent text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <type.icon className="h-5 w-5" />
                        <span className="text-[10px] font-bold truncate w-full text-center">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Reading Value</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter value..."
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none transition-all font-display text-xl font-bold placeholder:text-muted-foreground/30"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground uppercase text-xs">
                      {VITAL_TYPES.find(t => t.id === newType)?.unit}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleLogVital}
                  disabled={!newValue || isLogging}
                  className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLogging ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Vital Record"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

