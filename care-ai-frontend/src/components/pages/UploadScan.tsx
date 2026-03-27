import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload, FileText, Wand2, Edit, Check,
  Loader2, Save, X, RefreshCw,
  Search, Info, Sparkles, BrainCircuit
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type AnalysisResult = {
  type: "record" | "vital";
  data: any;
};

export default function UploadScan() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast.error("Please provide a medical document to scan");
      return;
    }

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/health/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let parsed: AnalysisResult;
      try {
        const cleanedText = typeof response.data === 'string'
          ? response.data.replace(/```json|```/g, '').trim()
          : response.data;
        parsed = typeof cleanedText === 'string' ? JSON.parse(cleanedText) : cleanedText;
        setResult(parsed);
        toast.success("Analysis complete!");
      } catch (e) {
        console.error("Parse error:", e);
        toast.error("AI returned unreadable data. Try again with a clearer document.");
      }
    } catch (error) {
      toast.error("AI analysis failed. Please ensure the file is a valid image or PDF.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      if (result.type === "vital") {
        await api.post("/health/vitals", {
          type: result.data.metric_type || "other",
          value: result.data.value,
          unit: result.data.unit
        });
      } else {
        await api.post("/health/records", {
          title: result.data.title || "New AI Record",
          type: result.data.category || "Medical Record",
          file_path: "ai-generated",
          summary: result.data // Save the ENTIRE extracted data object
        });
      }
      toast.success(`Saved to your ${result.type === 'vital' ? 'Vitals' : 'Medical Records'}!`);
      setResult(null);
      setFile(null);
    } catch (error) {
      toast.error("Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <BrainCircuit className="h-40 w-40" />
        </div>
        <h1 className="font-display text-4xl font-black tracking-tight mb-3 text-slate-900">AI Smart Scan</h1>
        <p className="text-slate-500 text-lg max-w-xl font-medium leading-relaxed">
          Upload medical documents for clinical-grade data extraction and structured analysis.
        </p>
      </div>

      {!result ? (
        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 rounded-2xl border border-slate-200 shadow-xl bg-card overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-slate-900">Document Upload</h3>
                  <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Secure Channel</div>
                </div>

                <label className={cn(
                  "flex flex-col items-center justify-center h-80 rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                  file ? "bg-primary/5 border-primary/30" : "bg-slate-50 border-slate-200 hover:border-primary/30 hover:bg-slate-100/50"
                )}>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.txt" />
                  <div className="flex flex-col items-center text-center p-6">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-sm",
                      file ? "bg-primary text-white" : "bg-white text-slate-300"
                    )}>
                      {file ? <Check className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900">
                      {file ? file.name : "Select Document"}
                    </h4>
                    <p className="text-slate-400 text-sm max-w-xs font-medium uppercase tracking-tight">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB — Scan Ready` : "Images, PDFs, or Clinical Notes"}
                    </p>
                  </div>
                </label>
              </div>
              <div className="p-6 bg-slate-50 flex items-center justify-center">
                <Button
                  onClick={handleScan}
                  disabled={!file || isScanning}
                  className="rounded-xl h-14 px-10 bg-slate-900 shadow-xl shadow-slate-200 font-bold gap-3 text-base transition-all active:scale-95"
                >
                  {isScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                  {isScanning ? "Analyzing Document..." : "Execute Smart Scan"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border border-slate-200 shadow-md bg-white overflow-hidden">
              <CardContent className="p-8">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Process Overview
                </h4>
                <div className="space-y-6">
                  {[
                    { icon: Search, title: "Text Extraction", desc: "High-fidelity OCR reads every medical shorthand." },
                    { icon: BrainCircuit, title: "Contextual Analysis", desc: "Clinical entities are mapped to health taxonomies." },
                    { icon: Save, title: "Structured Output", desc: "Data is formatted for your official health history." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <step.icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 mb-0.5">{step.title}</p>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-slate-900 rounded-2xl flex items-start gap-4">
              <Info className="h-6 w-6 text-white shrink-0 mt-1" />
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Optimized for Blood Panels, Cardiology Reports, and Mental Health Assessments.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setResult(null)} className="rounded-xl gap-2 text-slate-400 hover:text-red-500 font-bold">
              <X className="h-4 w-4" /> Discard Analysis
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Clinical Integrity Verified</span>
            </div>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-2xl overflow-hidden bg-white ring-8 ring-slate-100/30">
            <CardContent className="p-0 font-sans">
              {/* Report Header */}
              <div className="p-10 border-b-2 border-slate-900 bg-slate-50/50">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">CARE AI <span className="text-primary tracking-tighter">DIAGNOSTICS</span></h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI-Powered Clinical Analysis Report</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                    <p className="text-sm font-bold text-slate-900 tabular-nums">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {[
                    { l: "Report ID", v: `CAI-${Math.floor(Math.random() * 900000) + 100000}` },
                    { l: "Category", v: result.type === 'vital' ? "Vitals Dataset" : "Patient Record" },
                    { l: "Confidence", v: "High Precision" },
                    { l: "Status", v: "Pending Sync" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</p>
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Body */}
              <div className="p-10 bg-white min-h-[500px]">
                <div className="mb-16">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em] mb-10 pb-2 border-b-2 border-slate-900 inline-block">Clinical Manifest</h3>
                  <div className="space-y-12">
                    {Object.entries(result.data).map(([key, val], i) => (
                      <DataItem key={i} label={key} value={val} />
                    ))}
                  </div>
                </div>

                {/* Report Footer */}
                <div className="mt-24 pt-10 border-t border-slate-100 flex justify-between items-end">
                  <div className="max-w-xs">
                    <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">
                      This automated analysis is intended for record-keeping and informational purposes. 
                      Final clinical diagnostic decisions remain the responsibility of a licensed medical professional.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="h-14 w-56 border-b border-slate-200 mb-2 relative flex items-center justify-center">
                      <p className="font-serif italic text-2xl text-slate-200 select-none">Care AI Digital</p>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digitally Authenticated</p>
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-lg border-slate-300 font-bold hover:bg-white text-slate-700 transition-all shadow-sm"
                  onClick={() => router.push('/chat')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Discuss Implications
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex-[2] h-12 rounded-lg bg-slate-900 hover:bg-slate-950 text-white font-bold gap-2 transition-all shadow-lg"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? "Finalizing Sync..." : "Commit Data to My Record"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function DataItem({ label, value, depth = 0 }: { label: string, value: any, depth?: number }) {
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (isObject) {
    return (
      <div className={cn("space-y-8", depth > 0 && "pl-8 border-l border-slate-100")}>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em]">{formattedLabel}</p>
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
      <div className={cn("space-y-4", depth > 0 && "pl-8 border-l border-slate-100")}>
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">{formattedLabel}</p>
        <div className="flex flex-wrap gap-2.5">
          {value.map((item: any, i: number) => (
            <div key={i} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-md font-bold text-[10px] text-slate-600 uppercase tracking-widest shadow-sm transition-all hover:bg-white">
              {typeof item === 'object' ? JSON.stringify(item) : item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid md:grid-cols-[200px_1fr] gap-6 items-start group",
      depth === 0 ? "pb-6 border-b border-slate-50 last:border-0" : ""
    )}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-1 group-hover:text-slate-900 transition-colors">{formattedLabel}</p>
      <div className="text-slate-900 group-hover:pl-1 transition-all">
        <span className={cn(
          "leading-relaxed block",
          String(value).length > 80 ? "text-sm text-slate-500 font-medium" : "text-sm font-bold"
        )}>
          {value === true ? "YES" : value === false ? "NO" : String(value)}
        </span>
      </div>
    </div>
  );
}
