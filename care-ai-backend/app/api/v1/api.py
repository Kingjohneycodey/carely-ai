from fastapi import APIRouter
from app.api.v1.endpoints import login, users, test, malaria_api
from app.api.routes import diagnosis

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(test.router, prefix="/test", tags=["test"])
api_router.include_router(malaria_api.router, tags=["malaria"])
api_router.include_router(diagnosis.router)
