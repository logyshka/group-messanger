from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Chat, User
from app.schemas.schemas import ChatCreate, ChatResponse
from app.auth.security import get_current_user

router = APIRouter()


@router.post("/chats", response_model=ChatResponse)
async def create_chat(
        chat: ChatCreate,
        _: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_chat = Chat(name=chat.name)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    return db_chat


@router.get("/chats", response_model=List[ChatResponse])
async def get_chats(
        _: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    user_chats = db.query(Chat).all()
    return user_chats


@router.get("/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(
        chat_id: int,
        _: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat
