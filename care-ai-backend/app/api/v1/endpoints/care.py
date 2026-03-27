from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import time
import logging
import requests
from app.api import deps
from app.models.user import User
from app.core.config import settings
from app.models.care import Doctor, EmergencyContact, Appointment
from app.schemas.care import (
    Doctor as DoctorSchema, 
    EmergencyContact as EmergencyContactSchema, 
    EmergencyContactCreate,
    Appointment as AppointmentSchema,
    AppointmentCreate,
    PaymentVerification
)

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

# --- Doctors ---
@router.get("/doctors", response_model=List[DoctorSchema])
def get_doctors(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    specialty: Optional[str] = None,
    sort: Optional[str] = "rating"
) -> Any:
    query = db.query(Doctor)
    if search:
        query = query.filter(Doctor.name.ilike(f"%{search}%") | Doctor.specialty.ilike(f"%{search}%"))
    if specialty and specialty.lower() != "all":
        query = query.filter(Doctor.specialty.ilike(f"{specialty}%"))
    if sort == "rating":
        query = query.order_by(Doctor.rating.desc())
    elif sort == "price_asc":
        query = query.order_by(Doctor.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Doctor.price.desc())
    return query.offset(skip).limit(limit).all()

@router.get("/doctors/{doctor_id}", response_model=DoctorSchema)
def get_doctor(doctor_id: int, db: Session = Depends(deps.get_db)) -> Any:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

# --- Emergency Contacts ---
@router.get("/emergency-contacts", response_model=List[EmergencyContactSchema])
def get_emergency_contacts(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)) -> Any:
    return db.query(EmergencyContact).filter(EmergencyContact.user_id == current_user.id).all()

@router.post("/emergency-contacts", response_model=EmergencyContactSchema)
def create_emergency_contact(contact_in: EmergencyContactCreate, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)) -> Any:
    contact = EmergencyContact(**contact_in.dict(), user_id=current_user.id)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

# --- Appointments ---
@router.get("/appointments", response_model=List[AppointmentSchema])
def get_user_appointments(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_user)) -> Any:
    return db.query(Appointment).filter(Appointment.user_id == current_user.id).order_by(Appointment.created_at.desc()).all()

@router.post("/appointments", response_model=AppointmentSchema)
async def create_appointment(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    appointment_in: AppointmentCreate
) -> Any:
    logger.info(f">> Path B: Creating Appointment for User {current_user.id} <<")
    
    doctor = db.query(Doctor).filter(Doctor.id == appointment_in.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    try:
        amount_val = int(doctor.price.replace("₦", "").replace(",", "").split(".")[0]) * 100
    except:
        amount_val = 200000 
    
    # Generate unique transaction reference
    txn_ref = f"CAREAI_{int(time.time()*1000)}_{current_user.id}"

    appointment = Appointment(
        **appointment_in.dict(), 
        user_id=current_user.id,
        status="pending",
        payment_status="unpaid",
        amount=amount_val,
        txn_ref=txn_ref
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    # We return the appointment. The frontend will now construct the Path B Form.
    return appointment

@router.post("/verify-payment")
async def verify_payment(
    *,
    db: Session = Depends(deps.get_db),
    verification: PaymentVerification
) -> Any:
    # Path B still uses the same verification endpoint
    url = f"https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode={settings.ISW_MERCHANT_CODE}&transactionreference={verification.txn_ref}&amount={verification.amount}"
    
    try:
        res = requests.get(url, verify=False, timeout=15)
        data = res.json()
        logger.info(f"Verification response: {data}")
    except Exception as e:
        logger.error(f"Verification Exception: {str(e)}")
        raise HTTPException(status_code=500, detail="Verification system unreachable")
    
    if data.get("ResponseCode") in ["00", "000"]:
        appointment = db.query(Appointment).filter(
            (Appointment.txn_ref == verification.txn_ref) | 
            ((Appointment.status == "pending") & (Appointment.amount == verification.amount))
        ).order_by(Appointment.created_at.desc()).first()
        
        if appointment:
            appointment.status = "confirmed"
            appointment.payment_status = "paid"
            appointment.txn_ref = verification.txn_ref
            db.commit()
            return {"status": "success", "appointment": appointment}
    
    raise HTTPException(status_code=400, detail="Payment verification failed")
