import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, Query

from app.database.database import get_db
from app.database.models import Message, User
from app.schemas.schemas import MessageCreate, MessageUpdate, MessageResponse
from app.auth.security import get_current_user

router = APIRouter()


@router.post("/chats/{chat_id}/messages", response_model=MessageResponse)
async def create_message(
        chat_id: int,
        message: MessageCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_message = Message(
        content=message.content,
        user_id=current_user.id,
        chat_id=chat_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/chats/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(
        chat_id: int,
        offset: int = Query(0),
        limit: int = Query(20),
        _: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        Message.chat_id == chat_id
    ).order_by(Message.created_at.desc()) \
        .offset(offset).limit(limit).all()

    return list(reversed(messages))

@router.get("/chats/{chat_id}/newMessages", response_model=List[MessageResponse])
async def get_new_messages(
        chat_id: int,
        last_message_id: int = Query(0),
        _: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    messages = db.query(Message)\
        .filter(Message.chat_id == chat_id)\
        .filter(Message.id > last_message_id)\
        .order_by(Message.created_at.desc())\
        .all()

    return messages


@router.put("/chats/{chat_id}/messages/{message_id}", response_model=MessageResponse)
async def update_message(
        chat_id: int,
        message_id: int,
        message: MessageUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_message = db.query(Message).filter(
        Message.id == message_id,
        Message.chat_id == chat_id,
    ).first()

    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")

    if db_message.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own messages")

    db_message.content = message.content
    db_message.updated_at = datetime.now()
    db.commit()
    db.refresh(db_message)
    return db_message


@router.delete("/chats/{chat_id}/messages/{message_id}", response_model=MessageResponse)
async def delete_message(
        chat_id: int,
        message_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    db_message = db.query(Message).filter(
        Message.id == message_id,
        Message.chat_id == chat_id,
    ).first()

    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")

    if db_message.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own messages")

    db.delete(db_message)
    db.commit()
    return db_message
