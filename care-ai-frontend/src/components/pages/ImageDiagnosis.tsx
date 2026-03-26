import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Image, Eye, Stethoscope, TestTube, FileText, Smile } from "lucide-react";

const modes = [
  { id: "skin", icon: Stethoscope, label: "Skin Condition" },
  { id: "lab", icon: TestTube, label: "Lab Result" },
  { id: "rx", icon: FileText, label: "Prescription" },
  { id: "eye", icon: Eye, label: "Eye Condition" },
  { id: "oral", icon: Smile, label: "Oral Health" },
];

export default function ImageDiagnosis() {
  const [mode, setMode] = useState("skin");
  const [hasImage, setHasImage] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">Image Diagnosis</h1>
        <p className="text-muted-foreground text-sm">Take a photo or upload an image for AI analysis</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
              mode === m.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"
            }`}
          >
            <m.icon className="h-4 w-4" /> {m.label}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      {!hasImage ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Image className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Upload an image</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Capture a live photo or select from your gallery. Supports JPEG, PNG up to 10MB.
            </p>
            <div className="flex gap-3">
              <Button variant="hero" onClick={() => setHasImage(true)}>
                <Camera className="h-4 w-4 mr-1" /> Take Photo
              </Button>
              <Button variant="outline" onClick={() => setHasImage(true)}>
                <Upload className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Mock Result */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-xl mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Image preview area</span>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-warning/20 text-warning border-warning/30 mb-2">Moderate</Badge>
                  <h3 className="font-display text-lg font-bold">Suspected Contact Dermatitis</h3>
                  <p className="text-sm text-muted-foreground mt-1">Inflammatory skin reaction, likely from irritant exposure</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-primary">82%</div>
                  <span className="text-xs text-muted-foreground">Confidence</span>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-medium">AI Analysis</p>
                <p className="text-muted-foreground">The image shows erythematous patches with mild scaling consistent with contact dermatitis. No signs of secondary infection detected. Recommend topical hydrocortisone 1% cream and avoiding suspected irritants.</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="hero">Save to Wallet</Button>
            <Button variant="outline" onClick={() => setHasImage(false)}>Scan Another</Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        ⚠️ AI image analysis is not a substitute for professional medical examination. High-risk findings will prompt immediate escalation.
      </p>
    </div>
  );
}
