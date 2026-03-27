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

# --- Health Wallet ---
@router.get("/wallet", response_model=List[WalletItemSchema])
def get_wallet(
    db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)
) -> Any:
    return db.query(WalletItem).filter(WalletItem.user_id == current_user.id).all()

@router.post("/analyze", response_model=Any)
async def analyze_document(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    # Read file content
    content_bytes = await file.read()
    
    # Define the part for the model
    # Gemini 2.0 Flash supports images, PDFs, etc.
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
        return response.text
    except Exception as e:
         # Log the error for better debugging
        print(f"Gemini Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze document. Please ensure it is a valid medical file (Image or PDF).")
