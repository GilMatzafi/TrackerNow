from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.pomodoro_session import (
    CreatePomodoroSession, 
    UpdatePomodoroSession, 
    PomodoroSessionResponse
)
from app.services.pomodoro_sessions import PomodoroSessionService

router = APIRouter()

@router.get("/", response_model=List[PomodoroSessionResponse])
def get_pomodoro_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all pomodoro sessions for the current user"""
    service = PomodoroSessionService(db)
    sessions = service.get_sessions(current_user.id, skip=skip, limit=limit)
    return sessions

@router.get("/weekly", response_model=List[PomodoroSessionResponse])
def get_weekly_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pomodoro sessions for the current week"""
    service = PomodoroSessionService(db)
    sessions = service.get_weekly_sessions(current_user.id)
    return sessions

@router.get("/today", response_model=List[PomodoroSessionResponse])
def get_today_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pomodoro sessions for today"""
    service = PomodoroSessionService(db)
    sessions = service.get_today_sessions(current_user.id)
    return sessions

@router.get("/today/work", response_model=List[PomodoroSessionResponse])
def get_today_work_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get completed work sessions for today"""
    service = PomodoroSessionService(db)
    sessions = service.get_today_work_sessions(current_user.id)
    return sessions

@router.get("/stats/total-work-time")
def get_total_work_time(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get total work time in minutes"""
    service = PomodoroSessionService(db)
    total_time = service.get_total_work_time(current_user.id)
    return {"total_work_time_minutes": total_time}

@router.get("/stats/today-work-time")
def get_today_work_time(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get today's work time in minutes"""
    service = PomodoroSessionService(db)
    today_time = service.get_today_work_time(current_user.id)
    return {"today_work_time_minutes": today_time}

@router.post("/", response_model=PomodoroSessionResponse)
def create_pomodoro_session(
    session_data: CreatePomodoroSession,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new pomodoro session"""
    service = PomodoroSessionService(db)
    session = service.create_session(current_user.id, session_data)
    return session

@router.get("/{session_id}", response_model=PomodoroSessionResponse)
def get_pomodoro_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific pomodoro session"""
    service = PomodoroSessionService(db)
    session = service.get_session(current_user.id, session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    return session

@router.put("/{session_id}", response_model=PomodoroSessionResponse)
def update_pomodoro_session(
    session_id: int,
    session_data: UpdatePomodoroSession,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a pomodoro session"""
    service = PomodoroSessionService(db)
    session = service.update_session(current_user.id, session_id, session_data)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    return session

@router.delete("/{session_id}")
def delete_pomodoro_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a pomodoro session"""
    service = PomodoroSessionService(db)
    success = service.delete_session(current_user.id, session_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pomodoro session not found"
        )
    return {"message": "Pomodoro session deleted successfully"}
