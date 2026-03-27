from typing import Optional
from pydantic import BaseModel

class DoctorBase(BaseModel):
    name: str
    specialty: str
    rating: float = 0.0
    reviews: int = 0
    price: Optional[str] = None
    available: Optional[str] = None
    lang: Optional[str] = None
    img: Optional[str] = None
    bio: Optional[str] = None
    experience_years: int = 0
    hospital: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

class EmergencyContactBase(BaseModel):
    name: str
    relation: Optional[str] = None
    phone: str

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContact(EmergencyContactBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    doctor_id: int
    date: str
    time: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    user_id: int
    status: str
    payment_status: str
    txn_ref: Optional[str] = None
    amount: Optional[int] = None
    payment_url: Optional[str] = None

    class Config:
        from_attributes = True

class PaymentVerification(BaseModel):
    txn_ref: str
    amount: int # in kobo
