import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [patientNotes, setPatientNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    condition: string;
    confidence: number;
    recommendation: string;
    doctorSummary: string;
    nextSteps: string[];
  } | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be 10MB or less.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const resetScan = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
    setPatientNotes("");
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please upload an image before running analysis.");
      return;
    }

    if (mode !== "skin") {
      setError("Image AI is currently available only for Skin Condition mode.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await api.post("/diagnosis/analyze", formData, {
        params: {
          patient_notes: patientNotes.trim() || undefined,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      setResult({
        condition: data?.skin_analysis?.condition ?? "Unknown",
        confidence: data?.skin_analysis?.confidence ?? 0,
        recommendation: data?.skin_analysis?.recommendation ?? "No recommendation provided.",
        doctorSummary: data?.doctor_summary ?? "No doctor summary available.",
        nextSteps: Array.isArray(data?.next_steps) ? data.next_steps : [],
      });

      toast({
        title: "Analysis complete",
        description: "AI diagnosis has been generated successfully.",
      });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === "string" ? detail : "Failed to analyze image. Please try again.";
      setError(message);
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      {!selectedFile ? (
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
              <Button variant="hero" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="h-4 w-4 mr-1" /> Take Photo
              </Button>
              <Button variant="outline" onClick={() => uploadInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onSelectImage}
            />
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelectImage}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {mode !== "skin" && (
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-4 text-sm">
                Skin Condition mode is currently the only mode connected to live AI analysis.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium">Patient notes (optional)</p>
              <Textarea
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Add symptoms or context for better analysis."
                className="min-h-22.5"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden">
                <img src={previewUrl} alt="Uploaded scan" className="h-full w-full object-cover" />
              </div>

              {!result ? (
                <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
                  Click Analyze to run AI diagnosis on this image.
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className="bg-primary/15 text-primary border-primary/30 mb-2">AI Result</Badge>
                      <h3 className="font-display text-lg font-bold">{result.condition}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.recommendation}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-primary">
                        {Math.round(result.confidence * 100)}%
                      </div>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                    <p className="font-medium">Doctor Summary</p>
                    <p className="text-muted-foreground">{result.doctorSummary}</p>
                    {result.nextSteps.length > 0 && (
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {result.nextSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {error && (
            <Card className="border-emergency/40 bg-emergency/5">
              <CardContent className="p-4 text-sm text-emergency">{error}</CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="hero" onClick={analyzeImage} disabled={isAnalyzing || mode !== "skin"}>
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
            <Button variant="outline" onClick={resetScan}>Scan Another</Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        ⚠️ AI image analysis is not a substitute for professional medical examination. High-risk findings will prompt immediate escalation.
      </p>
    </div>
  );
}
