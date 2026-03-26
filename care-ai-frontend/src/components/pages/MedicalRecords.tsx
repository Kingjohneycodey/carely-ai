import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, FileText, Pill, TestTube, Stethoscope, ChevronRight, Calendar } from "lucide-react";

const records = [
  { type: "diagnosis", title: "Malaria (Suspected)", source: "AI", date: "Today", severity: "Moderate" },
  { type: "diagnosis", title: "Contact Dermatitis", source: "AI + Doctor", date: "2 weeks ago", severity: "Low" },
  { type: "prescription", title: "Artesunate + Amodiaquine", source: "Dr. Adeyemi", date: "Yesterday", status: "Active" },
  { type: "prescription", title: "Hydrocortisone 1% Cream", source: "Dr. Obi", date: "2 weeks ago", status: "Completed" },
  { type: "lab", title: "Complete Blood Count", source: "City Lab", date: "Last week", status: "Normal" },
  { type: "lab", title: "Urinalysis Panel", source: "MedLab", date: "3 weeks ago", status: "Flagged" },
];

const medications = [
  { name: "Metformin 500mg", dose: "2x daily", progress: 65, remaining: "10 days left" },
  { name: "Amlodipine 5mg", dose: "1x daily", progress: 40, remaining: "18 days left" },
  { name: "Artesunate + Amodiaquine", dose: "As directed", progress: 15, remaining: "5 days left" },
];

const typeIcons: Record<string, React.ReactNode> = {
  diagnosis: <Stethoscope className="h-4 w-4 text-primary" />,
  prescription: <Pill className="h-4 w-4 text-warning" />,
  lab: <TestTube className="h-4 w-4 text-success" />,
};

export default function MedicalRecords() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Medical Records</h1>
        <p className="text-muted-foreground text-sm">All your diagnoses, prescriptions, and lab results</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-1" /> Filter</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {records.map((r, i) => (
            <Card key={i} className="hover:shadow-card transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  {typeIcons[r.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{r.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{r.date}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{r.severity || r.status}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="diagnoses" className="mt-4"><p className="text-sm text-muted-foreground p-4">Diagnoses records view</p></TabsContent>
        <TabsContent value="prescriptions" className="mt-4"><p className="text-sm text-muted-foreground p-4">Prescriptions view</p></TabsContent>
        <TabsContent value="labs" className="mt-4"><p className="text-sm text-muted-foreground p-4">Lab results view</p></TabsContent>
      </Tabs>

      {/* Active Medications */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Active Medications</h3>
          <div className="space-y-4">
            {medications.map((med, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dose} · {med.remaining}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{med.progress}%</span>
                </div>
                <Progress value={med.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
