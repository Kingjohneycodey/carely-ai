from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import datetime

# Vitals
class VitalBase(BaseModel):
    type: str # blood_pressure, heart_rate, temperature, weight, glucose
    value: str
    unit: Optional[str] = None

class VitalCreate(VitalBase):
    pass

class Vital(VitalBase):
    id: int
    recorded_at: datetime
    user_id: int

    class Config:
        orm_mode = True

# Medical Records
class MedicalRecordBase(BaseModel):
    title: str
    type: Optional[str] = None
    date: Optional[datetime] = None

class MedicalRecordCreate(MedicalRecordBase):
    file_path: str
    summary: Optional[Any] = None

class MedicalRecord(MedicalRecordBase):
    id: int
    file_path: str
    summary: Optional[Any] = None
    created_at: datetime

    class Config:
        orm_mode = True

# Wallet
class WalletItemBase(BaseModel):
    label: str
    sub_label: Optional[str] = None
    type: str # Insurance, ID, etc.
    data: Optional[Any] = None

class WalletItemCreate(WalletItemBase):
    image_url: Optional[str] = None

class WalletItem(WalletItemBase):
    id: int
    image_url: Optional[str] = None
    user_id: int

    class Config:
        orm_mode = True
