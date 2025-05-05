from fastapi import APIRouter

from app.api import auth, chats, messages

api_router = APIRouter()

# Include the routers from the modules
api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(chats.router, tags=["chats"])
api_router.include_router(messages.router, tags=["messages"])