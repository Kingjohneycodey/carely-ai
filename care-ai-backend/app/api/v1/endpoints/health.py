from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.health import MedicalRecord, Vital, WalletItem
from app.schemas.health import (
    MedicalRecord as MedicalRecordSchema, MedicalRecordCreate,
    Vital as VitalSchema, VitalCreate,
    WalletItem as WalletItemSchema, WalletItemCreate
)
from google import genai
from google.genai import types
from app.core.config import settings

router = APIRouter()

# --- Vitals ---
@router.get("/vitals", response_model=List[VitalSchema])
def get_vitals(
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    return db.query(Vital).filter(Vital.user_id == current_user.id).order_by(Vital.recorded_at.desc()).all()

@router.post("/vitals", response_model=VitalSchema)
def create_vital(
    vital_in: VitalCreate,
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    vital = Vital(**vital_in.dict(), user_id=current_user.id)
    db.add(vital)
    db.commit()
    db.refresh(vital)
    return vital

@router.delete("/vitals/{vital_id}")
def delete_vital(
    vital_id: int,
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    vital = db.query(Vital).filter(Vital.id == vital_id, Vital.user_id == current_user.id).first()
    if not vital:
        raise HTTPException(status_code=404, detail="Vital not found")
    db.delete(vital)
    db.commit()
    return {"status": "success"}

# --- Medical Records ---
@router.get("/records", response_model=List[MedicalRecordSchema])
def get_records(
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    return db.query(MedicalRecord).filter(MedicalRecord.user_id == current_user.id).order_by(MedicalRecord.created_at.desc()).all()

@router.post("/records", response_model=MedicalRecordSchema)
def create_record(
    record_in: MedicalRecordCreate,
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    record = MedicalRecord(**record_in.dict(), user_id=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/records/{record_id}", response_model=MedicalRecordSchema)
def get_record(
    record_id: int,
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id, MedicalRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@router.delete("/records/{record_id}")
def delete_record(
    record_id: int,
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id, MedicalRecord.user_id == current_user.id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"status": "success"}

@router.post("/analyze", response_model=Any)
async def analyze_document(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    content_bytes = await file.read()
    
    part = types.Part.from_bytes(
        data=content_bytes,
        mime_type=file.content_type
    )
    
    prompt = """
    Analyze the following medical document and extract structured data.
    Identify if it's a Medical Record (Lab Report, Prescription, Diagnosis) or a Vital (Blood Pressure, Heart Rate, Glucose, etc.).
    Respond in JSON format only with keys like:
    - type: "record" | "vital"
    - data: { 
        extracted fields relevant to the type 
        (e.g., if record: title, summary, category; if vital: value, unit, metric_type)
      }
    
    Respond STRICTLY in JSON format. Do not include any other text.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, part]
        )
        # Handle potential markdown formatting from Gemini
        text = response.text.strip().replace("```json", "").replace("```", "")
        return text
    except Exception as e:
        print(f"Gemini Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze document.")

@router.post("/symptoms/analyze", response_model=Any)
async def analyze_symptoms(
    data: dict,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    symptoms = data.get("symptoms", "")
    step = data.get("step", "initial")
    context = data.get("context", [])
    
    if step == "initial":
        prompt = f"""
        A patient is reporting the following symptoms: {symptoms}.
        As a medical AI assistant tailored for the Nigerian/African context, provide:
        1. A set of 3-4 highly relevant follow-up questions to narrow down the condition.
        2. A very brief preliminary observation.
        
        Respond in JSON format:
        {{
            "status": "questions",
            "questions": [
                {{
                    "id": "q1",
                    "question": "question text",
                    "options": ["opt1", "opt2", "opt3", "opt4"]
                }},
                ...
            ],
            "observation": "text"
        }}
        """
    else:
        # Final Diagnosis
        prompt = f"""
        Patient Symptoms: {symptoms}
        Follow-up answers: {context}
        
        Provide a structured AI assessment based on these symptoms (Tailored for Nigerian context, e.g. considering Malaria, Typhoid if applicable).
        Respond in JSON format:
        {{
            "status": "result",
            "condition": "Condition Name (Suspected)",
            "severity": "Low" | "Moderate" | "High",
            "confidence": 85,
            "summary": "Brief explanation",
            "alternatives": [
                {{ "name": "Alternative 1", "confidence": 15 }}
            ],
            "actions": [
                {{ "step": "1", "title": "Immediate Care", "desc": "..." }},
                ...
            ]
        }}
        """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        text = response.text.strip().replace("```json", "").replace("```", "")
        import json
        return json.loads(text)
    except Exception as e:
        print(f"Symptom Index Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze symptoms.")

@router.post("/diagnosis/image", response_model=Any)
async def diagnose_image(
    file: UploadFile = File(...),
    mode: str = "skin",
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    content_bytes = await file.read()
    
    part = types.Part.from_bytes(
        data=content_bytes,
        mime_type=file.content_type
    )
    
    prompt = f"""
    Analyze this medical image (Category: {mode}).
    Provide a professional AI health assessment. 
    Respond in JSON format:
    {{
        "condition": "Suspected Condition Name",
        "severity": "Low" | "Moderate" | "High",
        "confidence": 90,
        "summary": "Brief explanation of visible indicators",
        "analysis": "Detailed clinical AI observation",
        "actions": ["Action 1", "Action 2"]
    }}
    
    STRICTLY JSON. No extra text.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, part]
        )
        text = response.text.strip().replace("```json", "").replace("```", "")
        import json
        return json.loads(text)
    except Exception as e:
        print(f"Image Diagnosis Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze image.")
