import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Camera, Upload, Image as ImageIcon, Eye, Stethoscope,
  TestTube, FileText, Smile, Loader2, Sparkles,
  AlertTriangle, ChevronRight, RotateCcw, Activity,
  Printer, Share2, Scan, ChevronLeft, Download, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "skin", icon: Stethoscope, label: "Skin Condition" },
  { id: "lab", icon: TestTube, label: "Lab Result" },
  { id: "rx", icon: FileText, label: "Prescription" },
  { id: "eye", icon: Eye, label: "Eye Health" },
  { id: "oral", icon: Smile, label: "Oral Care" },
];

interface DiagnosisResult {
  condition: string;
  severity: "Low" | "Moderate" | "High";
  confidence: number;
  summary: string;
  analysis: string;
  actions: string[];
}

export default function ImageDiagnosis() {
  const [mode, setMode] = useState("skin");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please provide an image first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await api.post("/health/diagnosis/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data);
    } catch (error) {
      toast.error("AI Analysis failed. Please try again with a clearer image.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-20">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
           <Button variant="ghost" onClick={reset} className="gap-2 font-bold text-slate-500 hover:text-slate-900">
              <ChevronLeft className="h-4 w-4" /> New Diagnosis
           </Button>
           <div className="flex gap-2">
              <Button variant="outline" className="gap-2 font-bold px-4">
                 <Printer className="h-4 w-4" /> Print
              </Button>
              <Button variant="outline" className="gap-2 font-bold px-4">
                 <Share2 className="h-4 w-4" /> Share
              </Button>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
           <div className="lg:col-span-1 space-y-6">
              <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
                 <CardHeader className="bg-slate-50 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Captured Evidence</CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="aspect-square bg-slate-100 relative">
                       {preview && <img src={preview} alt="Capture" className="h-full w-full object-cover" />}
                       <Badge className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border-none text-white font-bold">
                          {mode.replace('_', ' ').toUpperCase()} SCAN
                       </Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100">
                 <CardContent className="p-6 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Stats</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">AI Confidence</span>
                          <span className="font-bold text-slate-900">{result.confidence}%</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Scan Metadata</span>
                          <span className="font-bold text-slate-900">Verified</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
                 <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-50">
                    <div className="flex items-start justify-between">
                       <div className="space-y-1">
                          <Badge className={cn(
                            "mb-2 border-none font-bold",
                            result.severity === "High" ? "bg-red-500 text-white" : 
                            result.severity === "Moderate" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                          )}>
                            {result.severity} Priority
                          </Badge>
                          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{result.condition}</h2>
                          <p className="text-slate-500 text-base leading-relaxed mt-2">{result.summary}</p>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-8 space-y-10">
                    <div className="space-y-4">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" /> AI Observation Trace
                       </h3>
                       <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium leading-relaxed">
                          {result.analysis}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="font-bold text-slate-900">Recommended Next Steps</h3>
                       <div className="grid gap-3">
                          {result.actions.map((action, i) => (
                             <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold text-slate-800">{action}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                       <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                          <p className="text-xs text-amber-800 leading-relaxed italic">
                             Warning: This AI-generated assessment is for supplementary information only. Please confirm with a licensed medical professional immediately if symptoms persist.
                          </p>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans pb-20">
      <div className="space-y-2 border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Image Diagnosis</h1>
        <p className="text-slate-500 text-lg max-w-lg leading-relaxed font-medium">Use AI computer vision to identify patterns in skin conditions, lab results, and more.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 border-r border-slate-100 pr-4">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Diagnosis Mode</p>
           <div className="grid gap-2">
              {MODES.map(m => (
                 <button
                   key={m.id}
                   onClick={() => setMode(m.id)}
                   className={cn(
                     "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                     mode === m.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                   )}
                 >
                    <m.icon className={cn("h-4 w-4", mode === m.id ? "text-primary" : "text-slate-400")} /> {m.label}
                 </button>
              ))}
           </div>
        </div>

        <div className="lg:col-span-3">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={cn(
               "relative h-[440px] w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden",
               preview ? "border-slate-300" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
             )}
           >
              {preview ? (
                 <div className="relative w-full h-full">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
                        <Scan className="h-10 w-10 animate-pulse" />
                        <p className="text-xs font-bold uppercase tracking-widest">Click to Change Image</p>
                    </div>
                 </div>
              ) : (
                 <div className="text-center space-y-4">
                    <div className="h-20 w-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100">
                       <ImageIcon className="h-10 w-10 text-slate-200" />
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-slate-900">Upload Clinical Image</h3>
                       <p className="text-xs text-slate-400 font-medium mt-1">JPEG/PNG/HEIC. Ensure good lighting.</p>
                    </div>
                    <Button variant="outline" className="rounded-lg h-10 font-bold border-slate-200">
                       Select Source Image
                    </Button>
                 </div>
              )}
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             className="hidden" 
             accept="image/*" 
           />

           <div className="mt-8 flex gap-4">
              <Button 
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="flex-1 h-14 bg-slate-900 rounded-xl font-bold shadow-xl shadow-slate-200 text-lg"
              >
                 {isLoading ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <Scan className="h-6 w-6 mr-3" />}
                 Commence AI Analysis
              </Button>
              {preview && (
                 <Button variant="outline" onClick={reset} className="h-14 w-14 rounded-xl border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <X className="h-6 w-6" />
                 </Button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
