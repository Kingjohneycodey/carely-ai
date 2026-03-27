from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(100)) # Lab Report, Prescription, etc.
    date = Column(DateTime)
    file_path = Column(String(512))
    summary = Column(JSON) # AI generated summary
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="medical_records")

class Vital(Base):
    __tablename__ = "vitals"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False) # blood_pressure, heart_rate, temperature, etc.
    value = Column(String(100), nullable=False)
    unit = Column(String(20))
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    user = relationship("User", back_populates="vitals")

class WalletItem(Base):
    __tablename__ = "wallet_items"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    sub_label = Column(String(255))
    type = Column(String(100)) # Insurance, ID, Prescription Card
    data = Column(JSON) # Store card details, policy numbers, etc.
    image_url = Column(String(512))
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    user = relationship("User", back_populates="wallet_items")
