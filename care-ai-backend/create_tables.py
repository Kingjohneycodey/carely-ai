from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.models.health import MedicalRecord, Vital, WalletItem
from app.models.care import Doctor, EmergencyContact
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
