import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText, Calendar, Printer, Share2, Trash2, X,
  ChevronLeft, Sparkles, Loader2, Download, AlertCircle
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

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecord = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/health/records/${id}`);
      setRecord(response.data);
    } catch (error) {
      toast.error("Failed to load clinical record detail");
      router.push('/records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this clinical record?")) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/health/records/${id}`);
      toast.success("Record deleted successfully");
      router.push('/records');
    } catch (error) {
      toast.error("Deletion failed");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-slate-300 animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Clinical Manifest...</p>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 font-sans">
      {/* Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/records')}
          className="rounded-lg h-11 text-slate-400 hover:text-slate-900 group"
        >
          <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Records
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-lg h-11 border-slate-200 font-bold px-5 text-slate-600">
              <Printer className="h-4 w-4 mr-2" /> Print
           </Button>
           <Button variant="outline" className="rounded-lg h-11 border-slate-200 font-bold px-5 text-slate-600">
              <Share2 className="h-4 w-4 mr-2" /> Share
           </Button>
           <Button 
             variant="outline" 
             onClick={handleDelete}
             disabled={isDeleting}
             className="rounded-lg h-11 border-slate-200 font-bold px-5 text-red-500 hover:bg-red-50 hover:border-red-100"
           >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
           </Button>
        </div>
      </div>

      {/* The "Paper" Document Section */}
      <Card className="rounded-xl border border-slate-200 shadow-2xl overflow-hidden bg-white ring-8 ring-slate-100/30">
        <CardContent className="p-0">
          {/* Formal Clinical Header */}
          <div className="p-10 md:p-14 border-b-2 border-slate-900 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-14">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">CARE AI <span className="text-primary tracking-tighter">DIAGNOSTICS</span></h2>
                <div className="flex items-center gap-2">
                   <div className="h-4 w-4 bg-primary/10 rounded flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-primary" />
                   </div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI-Powered Clinical Analysis Report</p>
                </div>
              </div>
              <div className="text-left md:text-right space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Date</p>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {new Date(record.date || record.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { l: "Report Identifier", v: `CAI-${record.id.toString().padStart(6, '0')}` },
                 { l: "Document Type", v: record.type },
                 { l: "Clinical Origin", v: "Digital Scan Analysis" },
                 { l: "Integrity Status", v: "Patient Authenticated" }
               ].map((item, i) => (
                 <div key={i} className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.l}</p>
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.v}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Clinical Record Body */}
          <div className="p-10 md:p-16 bg-white min-h-[600px]">
             <div className="mb-20">
                <div className="flex items-center gap-4 mb-12">
                   <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] pb-1 border-b-4 border-slate-900 leading-none">Record Outcome Manifest</h3>
                </div>

                <div className="space-y-14">
                  {record.summary ? (
                    typeof record.summary === 'string' ? (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">Clinical Observations</p>
                        <p className="text-base font-medium leading-[1.8] text-slate-600 bg-slate-50/50 p-6 rounded-lg border border-slate-100">{record.summary}</p>
                      </div>
                    ) : (
                      Object.entries(record.summary).map(([key, val]: [string, any], i) => (
                        <DataItem key={i} label={key} value={val} />
                      ))
                    )
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                       <AlertCircle className="h-10 w-10 text-slate-200" />
                       <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Detailed Analysis Data Not Present</p>
                    </div>
                  )}
                </div>
             </div>

             {/* Footer Legal/Signature */}
             <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="max-w-sm space-y-3">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Legal Information</p>
                   <p className="text-[11px] font-medium text-slate-400 italic leading-[1.6]">
                      This document is a digital representation of a medical scan processed via Care AI. It is provided for summary and reference—final clinical interpretation belongs to a licensed medical professional.
                   </p>
                </div>
                <div className="text-right space-y-3">
                   <div className="h-16 w-64 border-b border-slate-100 mb-2 relative flex items-center justify-center grayscale">
                      <p className="font-serif italic text-3xl text-slate-200 select-none tracking-tighter">Care AI Authenticated</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Manifest Seal</p>
                      <p className="text-[9px] font-bold text-slate-300 tabular-nums uppercase">VERIFIED: {new Date(record.created_at).toISOString()}</p>
                   </div>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DataItem({ label, value, depth = 0 }: { label: string, value: any, depth?: number }) {
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (isObject) {
    return (
      <div className={cn("space-y-10", depth > 0 && "pl-10 border-l-2 border-slate-50")}>
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-slate-200" />
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">{formattedLabel}</p>
        </div>
        <div className="space-y-10">
          {Object.entries(value).map(([k, v], i) => (
            <DataItem key={i} label={k} value={v} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  if (isArray) {
    return (
      <div className={cn("space-y-5", depth > 0 && "pl-10 border-l-2 border-slate-50")}>
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">{formattedLabel}</p>
        <div className="flex flex-wrap gap-3">
          {value.map((item: any, i: number) => (
            <div key={i} className="bg-slate-50 border border-slate-200/60 px-5 py-2.5 rounded-lg font-bold text-[11px] text-slate-600 uppercase tracking-widest shadow-sm transition-all hover:bg-white hover:border-slate-300">
              {typeof item === 'object' ? JSON.stringify(item) : item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid md:grid-cols-[240px_1fr] gap-8 items-start group",
      depth === 0 ? "pb-8 border-b border-slate-50 last:border-0" : ""
    )}>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] pt-1 group-hover:text-slate-900 transition-colors leading-none">{formattedLabel}</p>
      <div className="text-slate-900 group-hover:pl-2 transition-all">
        <span className={cn(
          "leading-[1.6] block",
          String(value).length > 80 ? "text-base text-slate-600 font-medium" : "text-base font-bold"
        )}>
          {value === true ? "YES" : value === false ? "NO" : String(value)}
        </span>
      </div>
    </div>
  );
}
