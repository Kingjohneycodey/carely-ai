from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- 1. Skin Analysis Models ---
class SkinScanResult(BaseModel):
    condition: str = Field(..., example="Atopic Dermatitis")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score from EfficientNet")
    recommendation: str = Field(..., description="Initial triage recommendation")

# --- 2. Lab Result Models ---
class LabMetric(BaseModel):
    name: str = Field(..., example="HbA1c")
    value: float
    unit: str = Field(..., example="%")
    is_normal: bool
    reference_range: str = Field(..., example="4.0 - 5.6%")

class LabReportAnalysis(BaseModel):
    metrics: List[LabMetric]
    interpretation: str = Field(..., description="LLM-generated medical interpretation of the labs")

# --- 3. Unified Vector-MD Output ---
class UnifiedDiagnosisResponse(BaseModel):
    """The final object sent to the Frontend"""
    report_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    skin_analysis: Optional[SkinScanResult] = None
    lab_analysis: Optional[LabReportAnalysis] = None
    doctor_summary: str = Field(..., description="The final combined consultation note")
    next_steps: List[str]
    
    # Pydantic V2 Config
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "report_id": "VMD-2026-X89",
                "doctor_summary": "Patient shows signs of Eczema correlated with elevated IgE levels...",
                "next_steps": ["Apply topical steroid", "Follow up in 2 weeks"]
            }
        }
    )

class MalariaSymptomInput(BaseModel):
    fever_level: float = Field(..., ge=35, le=42, description="Body temperature in Celsius")
    chills: int = Field(..., description="0 for No, 1 for Yes")
    headache: int = Field(..., description="0 to 3 scale of severity")
    nausea: int = Field(..., description="0 or 1")
    age: int
    
class MalariaResponse(BaseModel):
    diagnosis: str
    confidence: float
    doctor_advice: str