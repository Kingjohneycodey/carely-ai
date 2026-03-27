import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Filter, FileText, Pill, TestTube,
  Stethoscope, ChevronRight, Calendar, Plus,
  Download, ExternalLink, ShieldCheck, Clock,
  Microscope, ClipboardList
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MedicalRecord = {
  id: number;
  title: string;
  type: string;
  date: string;
  file_path: string;
  summary: any;
  created_at: string;
};

const CATEGORIES = [
  { id: "all", label: "All Records", icon: ClipboardList },
  { id: "Diagnosis", label: "Diagnoses", icon: Stethoscope },
  { id: "Prescription", label: "Prescriptions", icon: Pill },
  { id: "Lab Report", label: "Lab Results", icon: Microscope },
];

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/health/records");
      setRecords(response.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "Prescription": return <Pill className="h-5 w-5" />;
      case "Lab Report": return <TestTube className="h-5 w-5" />;
      case "Diagnosis": return <Stethoscope className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Prescription": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Lab Report": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Diagnosis": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-[32px] border border-primary/5 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center shadow-inner">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-1">Medical Records</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Encrypted and secured health data</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold px-6 border-2 hover:bg-muted/50">
            <Download className="h-4 w-4" /> Export All
          </Button>
          <Button className="rounded-2xl gap-2 font-bold px-6 shadow-xl shadow-primary/20">
            <Plus className="h-4 w-4" /> New Record
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[32px] border-none shadow-lg overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 mb-2 block">Categories</label>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                      activeTab === cat.id
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "hover:bg-muted text-foreground/70"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Listing */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="font-display text-lg font-bold">Recent Files <Badge variant="secondary" className="ml-2 rounded-lg">{filteredRecords.length}</Badge></h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-bold">
              <Filter className="h-4 w-4 mr-2" /> Sort By: Date
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-24 w-full bg-muted rounded-[32px] animate-pulse" />
              ))
            ) : filteredRecords.length === 0 ? (
              <div className="py-20 text-center bg-card rounded-[32px] border-2 border-dashed border-border/50">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">No Records Found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredRecords.map((r) => (
                <Card key={r.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[32px] border-none shadow-md overflow-hidden cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-6 p-6">
                      <div className={cn(
                        "h-16 w-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform",
                        getBadgeColor(r.type).split(' ')[0]
                      )}>
                        <div className={cn(getBadgeColor(r.type).split(' ')[1])}>
                          {getIcon(r.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-display text-lg font-bold truncate group-hover:text-primary transition-colors">{r.title}</h4>
                          <Badge variant="outline" className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest", getBadgeColor(r.type))}>
                            {r.type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(r.date || r.created_at).toLocaleDateString()}
                          </div>
                          <div className="w-1 h-1 bg-border rounded-full" />
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary h-11 w-11">
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary h-11 w-11">
                          <Download className="h-5 w-5" />
                        </Button>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

