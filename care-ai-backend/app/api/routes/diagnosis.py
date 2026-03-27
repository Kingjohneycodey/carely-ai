import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
from datetime import datetime

from app.schemas.model import UnifiedDiagnosisResponse, SkinScanResult

from app.services.skin_service import predict_skin_condition
from app.services.chat_service import generate_medical_consultation

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

@router.post("/analyze", response_model=UnifiedDiagnosisResponse)
async def perform_diagnosis(
    image: UploadFile = File(...), 
    patient_notes: Optional[str] = None
):
    """
    1. Receives a skin image and optional symptoms.
    2. Runs EfficientNet for the skin scan.
    3. Passes results to Llama-3.2 for a professional summary.
    """
    try:
        # Save temp image and run EfficientNet
        image_bytes = await image.read()
        condition, confidence = predict_skin_condition(image_bytes)

        # Create the SkinScanResult object
        skin_result = SkinScanResult(
            condition=condition,
            confidence=confidence,
            recommendation="Please avoid scratching and consult a specialist."
        )

        # Use Llama-3.2 to generate the "Doctor's Advice"
        combined_prompt = f"Scan shows {condition}. Patient says: {patient_notes or 'No notes provided.'}"
        doctor_note = generate_medical_consultation(combined_prompt)

        # Construct the Final Unified Response
        return UnifiedDiagnosisResponse(
            report_id=f"VMD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=datetime.now(),
            skin_analysis=skin_result,
            doctor_summary=doctor_note,
            next_steps=["Book a physical derm exam", "Keep the area clean"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Pipeline Error: {str(e)}")