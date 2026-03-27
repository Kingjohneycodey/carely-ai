import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Mic, Send, ChevronRight, Clock, Activity,
  Stethoscope, CheckCircle2, RotateCcw, Loader2,
  AlertTriangle, ArrowRight, User, Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Step = "input" | "questions" | "result";

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface AssessmentResult {
  condition: string;
  severity: "Low" | "Moderate" | "High";
  confidence: number;
  summary: string;
  alternatives: { name: string; confidence: number }[];
  actions: { step: string; title: string; desc: string }[];
}

export default function SymptomChecker() {
  const [step, setStep] = useState<Step>("input");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleStartAnalysis = async () => {
    if (!text.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/health/symptoms/analyze", {
        symptoms: text,
        step: "initial"
      });
      setQuestions(response.data.questions);
      setStep("questions");
    } catch (error) {
      toast.error("AI analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalAnalysis = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions for accuracy");
      return;
    }
    setIsLoading(true);
    try {
      const context = Object.entries(answers).map(([id, opt]) => {
        const q = questions.find(q => q.id === id);
        return { question: q?.question, answer: opt };
      });
      const response = await api.post("/health/symptoms/analyze", {
        symptoms: text,
        step: "final",
        context
      });
      setResult(response.data);
      setStep("result");
    } catch (error) {
      toast.error("Assessment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setText("");
    setAnswers({});
    setResult(null);
  };

  if (step === "result" && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-20">
        <div className="flex items-center justify-between">
           <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Start Over
           </Button>
           <Badge className={cn(
             "px-4 py-1.5 rounded-full border-none font-bold",
             result.severity === "High" ? "bg-red-500 text-white" : 
             result.severity === "Moderate" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
           )}>
             {result.severity} Priority Level
           </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <Card className="md:col-span-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">AI Assessment Result</span>
                    <span className="text-sm font-bold text-slate-900">{result.confidence}% Confidence</span>
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 leading-tight">{result.condition}</h2>
                 <p className="text-slate-500 font-medium mt-2 leading-relaxed">{result.summary}</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 border-b border-slate-50 pb-2">Recommended Steps</h3>
                    <div className="grid gap-6">
                       {result.actions.map((item, i) => (
                         <div key={i} className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                               {item.step}
                            </div>
                            <div>
                               <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                               <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold">Alternative Conditions</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 pt-2">
                    {result.alternatives.map((alt, i) => (
                       <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <span className="font-semibold text-slate-700">{alt.name}</span>
                          <span className="text-slate-400 text-xs">{alt.confidence}%</span>
                       </div>
                    ))}
                 </CardContent>
              </Card>

              <div className="grid gap-3">
                 <Button className="w-full bg-slate-900 font-bold h-12" asChild>
                    <Link href="/doctors">Chat with a Doctor</Link>
                 </Button>
                 <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    ⚠️ This is an AI assessment. Always consult a healthcare provider for confirmation.
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 font-sans">
        <div className="text-center space-y-2 pb-6 border-b border-slate-100">
           <h1 className="text-2xl font-bold">Clarifying Details</h1>
           <p className="text-slate-500">Please provide more information to refine the AI analysis.</p>
        </div>

        <div className="space-y-10">
           {questions.map((q) => (
              <div key={q.id} className="space-y-5">
                 <p className="text-lg font-bold text-slate-900">{q.question}</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className={cn(
                          "px-6 py-4 rounded-xl border text-sm font-bold transition-all text-left",
                          answers[q.id] === opt 
                            ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                        )}
                      >
                         {opt}
                      </button>
                    ))}
                 </div>
              </div>
           ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex gap-4">
           <Button variant="ghost" onClick={reset} className="font-bold">Cancel</Button>
           <Button 
             className="flex-1 bg-slate-900 font-bold h-12 text-base" 
             onClick={handleFinalAnalysis}
             disabled={isLoading}
           >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Activity className="h-5 w-5 mr-2" />}
              Complete Assessment
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 font-sans pb-20">
      <div className="space-y-2 border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Symptom Checker</h1>
        <p className="text-slate-500 text-lg max-w-lg leading-relaxed font-medium">Describe how you feel, and AI will analyze potential conditions within seconds.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                 <Textarea
                   value={text}
                   onChange={e => setText(e.target.value)}
                   placeholder="Describe your symptoms in your own words..."
                   className="min-h-[220px] resize-none border-none p-0 focus-visible:ring-0 text-lg font-medium text-slate-900 placeholder:text-slate-300"
                 />
                 <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <Button variant="ghost" className="gap-2 text-slate-400 hover:text-slate-900 font-bold">
                       <Mic className="h-4 w-4" /> Voice Input
                    </Button>
                    <Button 
                      className="bg-slate-900 px-8 font-bold h-12" 
                      onClick={handleStartAnalysis}
                      disabled={isLoading || !text.trim()}
                    >
                       {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                       Analyze Now
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                 <div className="h-10 w-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                 </div>
                 <p className="text-sm font-bold">Comprehensive Analysis</p>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Cross-referenced with clinical databases and African health context.</p>
              </div>
              <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                 <div className="h-10 w-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                 </div>
                 <p className="text-sm font-bold">Clinical Escalation</p>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">High-severity results will prompt immediate emergency contact.</p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <Card className="border-slate-200 shadow-sm bg-slate-900 text-white rounded-2xl px-2">
              <CardHeader className="pb-2">
                 <CardTitle className="text-base">Quick Symptoms</CardTitle>
                 <CardDescription className="text-white/40">Select to add to description</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 pt-2">
                 {[
                   "Severe Headache", "High Fever", "Persistent Cough", 
                   "Abdominal Pain", "Chest Pressure", "Fatigue"
                 ].map(s => (
                   <button 
                     key={s} 
                     onClick={() => setText(prev => prev + (prev ? ', ' : '') + s)}
                     className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all text-white/80"
                   >
                     + {s}
                   </button>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
