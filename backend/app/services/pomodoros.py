from sqlalchemy.orm import Session
from app.models.pomodoro import Pomodoro, PomodoroStatus, PomodoroType
from app.schemas.pomodoro import PomodoroCreate, PomodoroUpdate
from typing import Optional, List
from datetime import datetime, timedelta

def list_pomodoros(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Pomodoro]:
    """List all pomodoros for a specific user"""
    return db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).offset(skip).limit(limit).all()

def get_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Get a specific pomodoro by ID for a user"""
    return db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()

def create_pomodoro(db: Session, payload: PomodoroCreate, user_id: int) -> Pomodoro:
    """Create a new pomodoro"""
    obj = Pomodoro(
        user_id=user_id,
        title=payload.title,
        description=payload.description,
        pomodoro_type=payload.pomodoro_type,
        duration_minutes=payload.duration_minutes,
        status=PomodoroStatus.PENDING
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_pomodoro(db: Session, pomodoro_id: int, payload: PomodoroUpdate, user_id: int) -> Optional[Pomodoro]:
    """Update a pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    # Don't allow updating if pomodoro is running
    if pomodoro.status == PomodoroStatus.RUNNING:
        raise ValueError("Cannot update a running pomodoro")
    
    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pomodoro, field, value)
    
    pomodoro.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def delete_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> bool:
    """Soft delete a pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return False
    
    # Don't allow deleting if pomodoro is running
    if pomodoro.status == PomodoroStatus.RUNNING:
        raise ValueError("Cannot delete a running pomodoro")
    
    pomodoro.is_active = False
    pomodoro.updated_at = datetime.utcnow()
    db.commit()
    return True

def start_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Start a pomodoro timer"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    # Check if there's already a running pomodoro for this user
    running_pomodoro = db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.status == PomodoroStatus.RUNNING,
        Pomodoro.is_active == True
    ).first()
    
    if running_pomodoro:
        raise ValueError("There is already a running pomodoro. Please pause or complete it first.")
    
    if pomodoro.status != PomodoroStatus.PENDING:
        raise ValueError("Can only start a pending pomodoro")
    
    pomodoro.status = PomodoroStatus.RUNNING
    pomodoro.started_at = datetime.utcnow()
    pomodoro.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def pause_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Pause a running pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    if pomodoro.status != PomodoroStatus.RUNNING:
        raise ValueError("Can only pause a running pomodoro")
    
    # Calculate how long it was running before pausing
    if pomodoro.started_at:
        running_duration = datetime.utcnow() - pomodoro.started_at
        pomodoro.paused_duration_seconds += int(running_duration.total_seconds())
    
    pomodoro.status = PomodoroStatus.PAUSED
    pomodoro.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def resume_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Resume a paused pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    if pomodoro.status != PomodoroStatus.PAUSED:
        raise ValueError("Can only resume a paused pomodoro")
    
    # Check if there's already a running pomodoro for this user
    running_pomodoro = db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.status == PomodoroStatus.RUNNING,
        Pomodoro.is_active == True
    ).first()
    
    if running_pomodoro:
        raise ValueError("There is already a running pomodoro. Please pause or complete it first.")
    
    pomodoro.status = PomodoroStatus.RUNNING
    pomodoro.started_at = datetime.utcnow()  # Reset start time for the resumed session
    pomodoro.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def complete_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Complete a pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    if pomodoro.status not in [PomodoroStatus.RUNNING, PomodoroStatus.PAUSED]:
        raise ValueError("Can only complete a running or paused pomodoro")
    
    pomodoro.status = PomodoroStatus.COMPLETED
    pomodoro.completed_at = datetime.utcnow()
    pomodoro.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def cancel_pomodoro(db: Session, pomodoro_id: int, user_id: int) -> Optional[Pomodoro]:
    """Cancel a pomodoro"""
    pomodoro = db.query(Pomodoro).filter(
        Pomodoro.id == pomodoro_id,
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).first()
    
    if not pomodoro:
        return None
    
    if pomodoro.status == PomodoroStatus.COMPLETED:
        raise ValueError("Cannot cancel a completed pomodoro")
    
    pomodoro.status = PomodoroStatus.CANCELLED
    pomodoro.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(pomodoro)
    return pomodoro

def get_active_pomodoro(db: Session, user_id: int) -> Optional[Pomodoro]:
    """Get the currently active (running or paused) pomodoro for a user"""
    return db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.status.in_([PomodoroStatus.RUNNING, PomodoroStatus.PAUSED]),
        Pomodoro.is_active == True
    ).first()

def get_pomodoro_stats(db: Session, user_id: int) -> dict:
    """Get pomodoro statistics for a user"""
    total_pomodoros = db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.is_active == True
    ).count()
    
    completed_pomodoros = db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.status == PomodoroStatus.COMPLETED,
        Pomodoro.is_active == True
    ).count()
    
    work_pomodoros = db.query(Pomodoro).filter(
        Pomodoro.user_id == user_id,
        Pomodoro.pomodoro_type == PomodoroType.WORK,
        Pomodoro.status == PomodoroStatus.COMPLETED,
        Pomodoro.is_active == True
    ).count()
    
    return {
        "total_pomodoros": total_pomodoros,
        "completed_pomodoros": completed_pomodoros,
        "work_pomodoros": work_pomodoros,
        "completion_rate": (completed_pomodoros / total_pomodoros * 100) if total_pomodoros > 0 else 0
    }
