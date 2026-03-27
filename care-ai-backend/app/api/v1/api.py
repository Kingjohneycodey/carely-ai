from fastapi import APIRouter
from app.api.v1.endpoints import login, users, test, chat, health, care

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(test.router, prefix="/test", tags=["test"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(care.router, prefix="/care", tags=["care"])
