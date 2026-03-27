from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True, unique=True)
    name = Column(String(255), nullable=False, index=True)
    specialty = Column(String(255), nullable=False, index=True)
    rating = Column(Float, default=0.0)
    reviews = Column(Integer, default=0)
    price = Column(String(100))
    available = Column(String(50)) # Online, Scheduled, Busy
    lang = Column(String(255))
    img = Column(String(255)) # Initials or Image URL
    bio = Column(Text, nullable=True)
    experience_years = Column(Integer, default=0)
    hospital = Column(String(255), nullable=True)

    user = relationship("User", back_populates="doctor_profile")
    doctor_appointments = relationship("Appointment", back_populates="doctor")
    
class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    relation = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="emergency_contacts_list")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date = Column(String(100), nullable=False)
    time = Column(String(100), nullable=False)
    status = Column(String(50), default="pending") # pending, confirmed, completed, cancelled
    payment_status = Column(String(50), default="unpaid") # unpaid, paid
    txn_ref = Column(String(255), nullable=True, unique=True)
    amount = Column(Integer, nullable=True) # in kobo
    payment_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="doctor_appointments")
