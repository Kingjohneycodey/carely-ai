import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Filter, FileText, Pill, TestTube,
  Stethoscope, ChevronRight, Calendar, Plus,
  Download, ExternalLink, Clock,
  Microscope, ClipboardList, Trash2, X, Sparkles,
  Printer, Share2, Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (recordId: number) => {
    if (!confirm("Are you sure you want to delete this record document? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await api.delete(`/health/records/${recordId}`);
      toast.success("Record deleted successfully");
      setRecords(records.filter(r => r.id !== recordId));
    } catch (error) {
      toast.error("Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRecords = records.filter(r => {
    const titleMatch = r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const summaryMatch = typeof r.summary === 'string'
      ? r.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : JSON.stringify(r.summary || {}).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = titleMatch || summaryMatch;
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
      case "Prescription": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Lab Report": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Diagnosis": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Medical Records</h1>
          <p className="text-slate-500 font-medium">Manage and view your clinical history and diagnostic logs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-lg h-11 border-slate-200 font-bold px-6">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button
            onClick={() => router.push('/upload')}
            className="rounded-lg h-11 bg-slate-900 font-bold px-6 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> New Upload
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-200 focus-visible:ring-slate-200"
                />
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Filters</p>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                      activeTab === cat.id
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 w-full bg-slate-50 rounded-lg animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <FileText className="h-10 w-10 text-slate-200 mx-auto mb-4" />
              <h3 className="font-bold text-slate-900 mb-1">No matches found</h3>
              <p className="text-sm text-slate-400">Refine your search or upload a new record.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  onClick={() => router.push(`/records/${r.id}`)}
                  className="flex items-center gap-6 p-5 cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <div className="h-10 w-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:text-primary transition-colors">
                    {getIcon(r.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate mb-0.5">{r.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{r.type}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span>{new Date(r.date || r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
