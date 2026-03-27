import os
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.care import Doctor
from app.models.chat import ChatSession, ChatMessage
from app.models.health import MedicalRecord, Vital, WalletItem

doctors_data = [
    { "name": "Dr. Adebayo Adeyemi", "specialty": "General Practitioner", "rating": 4.8, "reviews": 234, "price": "₦1,500", "available": "Online", "lang": "English, Yoruba", "img": "AA", "bio": "Over 15 years resolving complex medical conditions.", "experience_years": 15, "hospital": "Lagos University Teaching Hospital" },
    { "name": "Dr. Fatima Hassan", "specialty": "Pediatrics", "rating": 4.9, "reviews": 187, "price": "₦2,000", "available": "Online", "lang": "English, Hausa", "img": "FH", "bio": "Specialized in pediatric immunology.", "experience_years": 10, "hospital": "National Hospital Abuja" },
    { "name": "Dr. Chinwe Obi", "specialty": "Dermatology", "rating": 4.7, "reviews": 156, "price": "₦2,500", "available": "Scheduled", "lang": "English, Igbo", "img": "CO", "bio": "Expert in tropical skin diseases.", "experience_years": 8, "hospital": "University of Nigeria Teaching Hospital" },
    { "name": "Dr. Emmanuel Kalu", "specialty": "Cardiology", "rating": 4.6, "reviews": 98, "price": "₦3,000", "available": "Busy", "lang": "English", "img": "EK", "bio": "Renowned cardiologist with 20 years experience.", "experience_years": 20, "hospital": "Reddington Hospital" },
    { "name": "Dr. Amina Yusuf", "specialty": "Gynecology", "rating": 4.9, "reviews": 312, "price": "₦2,000", "available": "Online", "lang": "English, Hausa", "img": "AY", "bio": "Women's health advocate.", "experience_years": 12, "hospital": "Kano State Hospital" },
    { "name": "Dr. Babatunde Ogunleye", "specialty": "Orthopedics", "rating": 4.5, "reviews": 145, "price": "₦3,500", "available": "Scheduled", "lang": "English, Yoruba", "img": "BO", "bio": "Specialist in trauma and bone injuries.", "experience_years": 18, "hospital": "Igbobi Orthopedic Hospital" },
    { "name": "Dr. Ngozi Eze", "specialty": "Psychiatry", "rating": 4.8, "reviews": 210, "price": "₦2,000", "available": "Online", "lang": "English, Igbo", "img": "NE", "bio": "Mental health expert.", "experience_years": 14, "hospital": "Federal Neuropsychiatric Hospital Yaba" },
    { "name": "Dr. Olusegun Falola", "specialty": "Neurology", "rating": 4.7, "reviews": 105, "price": "₦4,000", "available": "Busy", "lang": "English, Yoruba", "img": "OF", "bio": "Neuroscience researcher and clinician.", "experience_years": 22, "hospital": "LUTH" },
    { "name": "Dr. Aisha Bello", "specialty": "Endocrinology", "rating": 4.6, "reviews": 88, "price": "₦2,500", "available": "Online", "lang": "English, Hausa", "img": "AB", "bio": "Diabetes and hormonal disorders specialist.", "experience_years": 9, "hospital": "Aminu Kano Teaching Hospital" },
    { "name": "Dr. Chidi Okafor", "specialty": "General Practitioner", "rating": 4.5, "reviews": 67, "price": "₦1,000", "available": "Online", "lang": "English, Igbo", "img": "CO", "bio": "Family medicine practitioner.", "experience_years": 5, "hospital": "Care AI Clinic" },
    { "name": "Dr. Seyi Makinde", "specialty": "Pediatrics", "rating": 4.8, "reviews": 190, "price": "₦2,000", "available": "Online", "lang": "English, Yoruba", "img": "SM", "bio": "Passionate about child health and nutrition.", "experience_years": 11, "hospital": "Mother and Child Centre" },
    { "name": "Dr. Halima Dankwambo", "specialty": "Gynecology", "rating": 4.9, "reviews": 402, "price": "₦2,500", "available": "Busy", "lang": "English, Hausa", "img": "HD", "bio": "Expert in maternal-fetal medicine.", "experience_years": 16, "hospital": "NHA" },
    { "name": "Dr. Tolu Aderemi", "specialty": "Dermatology", "rating": 4.7, "reviews": 134, "price": "₦2,000", "available": "Online", "lang": "English", "img": "TA", "bio": "Aesthetics and clinical dermatology.", "experience_years": 7, "hospital": "Skin Care Clinic Victoria Island" },
    { "name": "Dr. Kenneth Nnamani", "specialty": "Cardiology", "rating": 4.5, "reviews": 76, "price": "₦3,000", "available": "Scheduled", "lang": "English, Igbo", "img": "KN", "bio": "Interventional cardiologist.", "experience_years": 13, "hospital": "Euracare Multi-Specialist Hospital" },
    { "name": "Dr. Zaynab Umar", "specialty": "General Practitioner", "rating": 4.6, "reviews": 112, "price": "₦1,500", "available": "Online", "lang": "English, Hausa", "img": "ZU", "bio": "Focused on preventive medicine.", "experience_years": 6, "hospital": "Garki Hospital" },
    { "name": "Dr. Femi Peters", "specialty": "Orthopedics", "rating": 4.8, "reviews": 255, "price": "₦3,500", "available": "Online", "lang": "English", "img": "FP", "bio": "Sports medicine and joint replacement.", "experience_years": 19, "hospital": "St. Nicholas Hospital" },
    { "name": "Dr. Adaobi Nweke", "specialty": "Psychiatry", "rating": 4.9, "reviews": 315, "price": "₦2,500", "available": "Online", "lang": "English, Igbo", "img": "AN", "bio": "Specialized in CBT and adolescent psychiatry.", "experience_years": 10, "hospital": "Synapse Services" },
    { "name": "Dr. Ibrahim Musa", "specialty": "Neurology", "rating": 4.6, "reviews": 92, "price": "₦4,000", "available": "Scheduled", "lang": "English, Hausa", "img": "IM", "bio": "Stroke management and rehabilitation.", "experience_years": 15, "hospital": "Ahmadu Bello University Teaching Hospital" },
    { "name": "Dr. Ejiro Onoriode", "specialty": "Endocrinology", "rating": 4.7, "reviews": 140, "price": "₦3,000", "available": "Online", "lang": "English, Urhobo", "img": "EO", "bio": "Thyroid and chronic metabolic conditions.", "experience_years": 12, "hospital": "Delta State University Teaching Hospital" },
    { "name": "Dr. Bukola Saraki", "specialty": "General Practitioner", "rating": 4.8, "reviews": 501, "price": "₦2,000", "available": "Busy", "lang": "English, Yoruba", "img": "BS", "bio": "Public health advocate and experienced clinician.", "experience_years": 25, "hospital": "Medical Arts Center" },
]

def seed_db():
    db = SessionLocal()
    try:
        if db.query(Doctor).count() == 0:
            for data in doctors_data:
                doctor = Doctor(**data)
                db.add(doctor)
            db.commit()
            print("Successfully seeded 20 doctors!")
        else:
            print("Database already contains doctors. Skipping seed.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
