import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, FileText, Wand2, Edit, Check } from "lucide-react";
import { useState } from "react";

export default function UploadScan() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Upload & Scan</h1>
        <p className="text-muted-foreground text-sm">Upload medical documents for AI extraction and storage</p>
      </div>

      {!uploaded ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Upload a medical document</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Lab results, prescriptions, imaging reports — our AI will extract and categorize the data automatically.
            </p>
            <div className="flex gap-3">
              <Button variant="hero" onClick={() => setUploaded(true)}>
                <Camera className="h-4 w-4 mr-1" /> Scan Document
              </Button>
              <Button variant="outline" onClick={() => setUploaded(true)}>
                <Upload className="h-4 w-4 mr-1" /> Upload File
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">AI Extracted Data</h3>
                <span className="ml-auto text-xs text-muted-foreground">Auto-detected: Lab Result</span>
              </div>
              <div className="space-y-3">
                {[
                  { test: "Hemoglobin", value: "13.5 g/dL", range: "12.0 - 17.5", status: "normal" },
                  { test: "White Blood Cells", value: "11,200 /µL", range: "4,500 - 11,000", status: "high" },
                  { test: "Platelets", value: "245,000 /µL", range: "150,000 - 400,000", status: "normal" },
                  { test: "Blood Glucose", value: "142 mg/dL", range: "70 - 100", status: "high" },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                    row.status === "high" ? "bg-emergency/5 border border-emergency/20" : "bg-muted/30"
                  }`}>
                    <div>
                      <p className="text-sm font-medium">{row.test}</p>
                      <p className="text-xs text-muted-foreground">Ref: {row.range}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className={`text-sm font-semibold ${row.status === "high" ? "text-emergency" : ""}`}>
                        {row.value}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="hero"><Check className="h-4 w-4 mr-1" /> Confirm & Save</Button>
            <Button variant="outline" onClick={() => setUploaded(false)}>Upload Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
