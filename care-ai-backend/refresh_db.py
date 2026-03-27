from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.models.health import MedicalRecord, Vital, WalletItem
from app.models.care import Doctor, EmergencyContact, Appointment

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Tables refreshed successfully.")

# Re-seed doctors
from seed_doctors import seed_db
seed_db()
print("Doctors re-seeded.")
