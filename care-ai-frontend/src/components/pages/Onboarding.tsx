import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Heart, User, AlertCircle, Phone } from "lucide-react";
import Link from "next/link";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const conditions = ["Diabetes", "Hypertension", "Asthma", "HIV/AIDS", "Heart Disease", "Sickle Cell", "Epilepsy", "Arthritis"];
const allergies = ["Penicillin", "Aspirin", "Sulfa Drugs", "Ibuprofen", "Latex", "Peanuts", "None"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const steps = [
    // Step 0: Personal Basics
    <div key="basics" className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">This helps us personalize your health assessments</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" /></div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
            <option>Select</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Blood Group</Label>
        <div className="flex flex-wrap gap-2">
          {bloodGroups.map(bg => (
            <button key={bg} className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-accent hover:border-primary transition-colors">
              {bg}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Height (cm)</Label><Input type="number" placeholder="170" /></div>
        <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" placeholder="70" /></div>
      </div>
    </div>,

    // Step 1: Conditions
    <div key="conditions" className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Chronic Conditions</h2>
        <p className="text-sm text-muted-foreground">Select any conditions you're currently managing</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {conditions.map(c => (
          <button
            key={c}
            onClick={() => toggleItem(c, selectedConditions, setSelectedConditions)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              selectedConditions.includes(c) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Select none if not applicable</p>
    </div>,

    // Step 2: Allergies
    <div key="allergies" className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Allergies & Medications</h2>
        <p className="text-sm text-muted-foreground">We'll flag these in any prescription or recommendation</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {allergies.map(a => (
          <button
            key={a}
            onClick={() => toggleItem(a, selectedAllergies, setSelectedAllergies)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              selectedAllergies.includes(a) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Label>Current Medications (optional)</Label>
        <Input placeholder="Search and add medications..." />
      </div>
    </div>,

    // Step 3: Emergency Contacts
    <div key="emergency" className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold mb-1">Emergency Contacts</h2>
        <p className="text-sm text-muted-foreground">Required for Emergency Mode — add up to 3 contacts</p>
      </div>
      {[1, 2, 3].map(n => (
        <div key={n} className="bg-muted/50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium">Contact {n} {n === 1 && <span className="text-emergency text-xs">*Required</span>}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Name</Label><Input placeholder="Full name" /></div>
            <div className="space-y-1"><Label className="text-xs">Relationship</Label><Input placeholder="e.g. Spouse" /></div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="+234..." className="pl-10" />
            </div>
          </div>
        </div>
      ))}
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">Care AI</span>
        </div>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Skip for now</Link>
      </div>

      {/* Progress */}
      <div className="px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 max-w-lg mx-auto w-full">
        {steps[step]}
      </div>

      <div className="p-4 border-t border-border max-w-lg mx-auto w-full flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="h-11">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        {step < 3 ? (
          <Button variant="hero" onClick={() => setStep(step + 1)} className="flex-1 h-11">
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Link href="/dashboard" className="flex-1">
            <Button variant="hero" className="w-full h-11">
              Complete Setup <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
