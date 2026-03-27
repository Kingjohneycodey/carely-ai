from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ChatMessage(BaseModel):
    id: Optional[int] = None
    role: str
    content: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChatSessionBase(BaseModel):
    title: str = "New Chat"

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ChatSessionDetail(ChatSession):
    messages: List[ChatMessage]

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: int

