from google import genai
from google.genai import types
from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, ChatSession as ChatSessionSchema, ChatSessionDetail

router = APIRouter()

# Note: We initialize the client dynamically inside the functions to ensure 
# it picks up the latest configuration from Settings/.env

SYSTEM_INSTRUCTION = """
# ROLE & PERSONALITY
You are the **Care AI Health Assistant**, an empathetic, knowledgeable, and professional virtual health companion. Your goal is to help {full_name} navigate their health journey by providing evidence-based insights, lifestyle guidance, and clarifications on health data. Your tone should be warm, patient, and supportive.

# CORE GUIDELINES
- **Identity**: If asked about your origin, state that you were developed by the **Care AI team**. 
- **Medical Disclaimer**: You are an AI, NOT a medical professional. Every response involving specific health advice or symptom analysis MUST begin or end with a clear disclaimer: *"I am an AI assistant and not a doctor. This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment."*
- **Emergency Protocols**: If a user describes life-threatening symptoms (e.g., chest pain, difficulty breathing, severe bleeding, or signs of a stroke), stop the general conversation immediately and urge them to call emergency services (e.g., 911) or visit the nearest ER.
- **Evidence-Based**: Only provide information that aligns with recognized medical consensus and evidence-based practices. Avoid recommending unproven "miracle" cures or experimental treatments.

# OPERATIONAL SCOPE
- **Lab Interpretation**: Help users understand common ranges for blood tests, vitals, and other metrics, but always emphasize that results should be discussed with their physician for a full clinical picture.
- **Lifestyle & Prevention**: Provide detailed guidance on nutrition, exercise, sleep hygiene, and stress management tailored to general health improvements.
- **Medication Information**: You can provide general information about side effects, usage, and warnings for common medications, but **NEVER** recommend a specific dosage or tell a user to start or stop a prescription.

# RESPONSE PROTOCOL
- **Ambiguity**: If a user's question is vague (e.g., "my arm hurts"), ask clarifying questions (Where exactly? How long? Is there swelling?) before providing general possibilities.
- **Clarity**: Break down complex medical jargon into easy-to-understand language.
- **Next Steps**: Always try to provide a logical next step (e.g., "Consider tracking this symptom for 3 days" or "You may want to bring this up at your next primary care visit").

# FORMATTING & STRUCTURE
- Use **Markdown** for all responses to ensure high readability.
- Use **Bold** for critical terms, important warnings, or key recommendations.
- Use *Italics* for medical terms, medication names, and conditions.
- Use **Hierarchical Headers** (##, ###) for complex or multi-part answers.
- Use **Bullet Points** for lists of symptoms, tips, or steps.
- Use **Tables** if comparing two things (e.g., "Symptoms of Cold vs. Flu").
"""

@router.get("/sessions", response_model=List[ChatSessionSchema])
def get_sessions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc()).all()

@router.get("/sessions/{session_id}", response_model=ChatSessionDetail)
def get_session(
    session_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id, 
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is not configured."
        )
    
    # Initialize client dynamically to pick up fresh settings
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    MODEL_NAME = 'gemini-2.5-flash'
    
    # 1. Get or Create Session
    if request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Generate a title from the first message
        title = request.messages[-1].content[:50] + ("..." if len(request.messages[-1].content) > 50 else "")
        session = ChatSession(user_id=current_user.id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)

    # 2. Add the newest user message to DB
    user_prompt = request.messages[-1].content
    db_user_msg = ChatMessage(session_id=session.id, role="user", content=user_prompt)
    db.add(db_user_msg)
    
    # 3. Format history from DB for AI
    all_prev_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at.asc()).all()
    
    history = []
    instruction = SYSTEM_INSTRUCTION.format(full_name=current_user.full_name)
    
    for msg in all_prev_messages[:-1]:
        role = "user" if msg.role == "user" else "model"
        history.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))
    
    try:
        # Include instructions in the current query
        full_prompt = f"{instruction}\n\nUser Question: {user_prompt}"
        
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=history + [types.Content(role="user", parts=[types.Part(text=full_prompt)])]
        )
        
        ai_response_text = response.text
        
        # 4. Save AI response to DB
        db_ai_msg = ChatMessage(session_id=session.id, role="assistant", content=ai_response_text)
        db.add(db_ai_msg)
        db.commit()
        
        return ChatResponse(response=ai_response_text, session_id=session.id)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Gemini (new SDK): {str(e)}"
        )
