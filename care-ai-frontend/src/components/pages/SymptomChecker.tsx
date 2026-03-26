import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, ChevronRight, MapPin, Clock, Thermometer, ArrowRight } from "lucide-react";
import Link from "next/link";

const bodyParts = [
  "Head", "Eyes", "Throat", "Chest", "Abdomen", "Back", "Arms", "Legs", "Skin", "Joints"
];

const suggestedSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Body aches", "Sore throat", "Dizziness"
];

export default function SymptomChecker() {
  const [step, setStep] = useState<"input" | "questions" | "result">("input");
  const [text, setText] = useState("");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  if (step === "result") {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Diagnosis Result</h1>
          <p className="text-muted-foreground text-sm">Based on your symptoms and health history</p>
        </div>

        {/* Primary Condition */}
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-warning/20 text-warning border-warning/30 mb-2">Moderate Severity</Badge>
                <h2 className="font-display text-xl font-bold">Malaria (Suspected)</h2>
                <p className="text-muted-foreground text-sm mt-1">Based on fever, headache, and body aches lasting 3 days</p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold text-warning">74%</div>
                <span className="text-xs text-muted-foreground">Confidence</span>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 3 days duration</span>
              <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> High temperature</span>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Conditions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Card><CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-sm font-medium">Typhoid Fever</p><p className="text-xs text-muted-foreground">15% confidence</p></div>
            <Badge variant="outline" className="text-xs">Low</Badge>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-sm font-medium">Viral Infection</p><p className="text-xs text-muted-foreground">11% confidence</p></div>
            <Badge variant="outline" className="text-xs">Low</Badge>
          </CardContent></Card>
        </div>

        {/* Action Plan */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display font-semibold mb-4">Recommended Action Plan</h3>
            <div className="space-y-3">
              {[
                { step: "1", title: "Immediate Care", desc: "Take Paracetamol 500mg every 6 hours. Rest and increase fluid intake." },
                { step: "2", title: "Seek Confirmation", desc: "Visit a clinic within 24 hours for a Malaria RDT (Rapid Diagnostic Test)." },
                { step: "3", title: "Avoid", desc: "Do not take Aspirin. Avoid self-medicating with antimalarials without confirmation." },
                { step: "4", title: "Monitor", desc: "If fever exceeds 39°C or you experience confusion, activate Emergency Mode." },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/doctors"><Button variant="hero">Book a Doctor</Button></Link>
          <Link href="/facilities"><Button variant="outline">Find Pharmacy</Button></Link>
          <Button variant="outline">Save to Wallet</Button>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-4">
          ⚠️ This is an AI-assisted assessment and not a medical diagnosis. Always consult a qualified healthcare provider for confirmation and treatment.
        </p>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Follow-up Questions</h1>
          <p className="text-muted-foreground text-sm">Help us narrow down the assessment</p>
        </div>
        {[
          { q: "How long have you been experiencing these symptoms?", opts: ["Less than 24 hours", "1-3 days", "3-7 days", "More than a week"] },
          { q: "How would you rate the intensity?", opts: ["Mild", "Moderate", "Severe", "Very Severe"] },
          { q: "Have you taken any medication?", opts: ["Paracetamol", "Ibuprofen", "Antimalarials", "None"] },
          { q: "Any associated symptoms?", opts: ["Chills/Sweating", "Loss of appetite", "Joint pain", "Vomiting"] },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-3">{item.q}</p>
              <div className="flex flex-wrap gap-2">
                {item.opts.map(opt => (
                  <button key={opt} className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-accent hover:border-primary/30 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="hero" onClick={() => setStep("result")} className="w-full h-11">
          Get Diagnosis <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Symptom Checker</h1>
        <p className="text-muted-foreground text-sm">Describe your symptoms to get an AI-powered assessment</p>
      </div>

      {/* Text Input */}
      <Card>
        <CardContent className="p-4">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Describe your symptoms... e.g., I've had a headache and fever for 3 days"
            className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 text-base"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <Button variant="ghost" size="sm"><Mic className="h-4 w-4 mr-1" /> Voice</Button>
            <Button variant="hero" size="sm" onClick={() => setStep("questions")}>
              <Send className="h-4 w-4 mr-1" /> Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Symptoms */}
      <div>
        <p className="text-sm font-medium mb-3">Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSymptoms.map(s => (
            <button key={s} className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-accent hover:border-primary/30 transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Body Map (simplified) */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-3">Select affected area</p>
          <div className="grid grid-cols-5 gap-2">
            {bodyParts.map(part => (
              <button
                key={part}
                onClick={() => setSelectedParts(
                  selectedParts.includes(part) ? selectedParts.filter(p => p !== part) : [...selectedParts, part]
                )}
                className={`py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  selectedParts.includes(part) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
