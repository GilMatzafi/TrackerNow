from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.pomodoro import (
    PomodoroCreate, 
    PomodoroUpdate, 
    PomodoroResponse,
    PomodoroStart,
    PomodoroPause,
    PomodoroResume,
    PomodoroComplete,
    PomodoroCancel
)
from app.services.pomodoros import (
    list_pomodoros as svc_list,
    create_pomodoro as svc_create,
    get_pomodoro as svc_get,
    update_pomodoro as svc_update,
    delete_pomodoro as svc_delete,
    start_pomodoro as svc_start,
    pause_pomodoro as svc_pause,
    resume_pomodoro as svc_resume,
    complete_pomodoro as svc_complete,
    cancel_pomodoro as svc_cancel,
    get_active_pomodoro as svc_get_active,
    get_pomodoro_stats as svc_get_stats
)

router = APIRouter(prefix="/pomodoros", tags=["pomodoros"])

@router.get("", response_model=list[PomodoroResponse])
def list_pomodoros(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all pomodoros for the current user"""
    return svc_list(db, current_user.id, skip=skip, limit=limit)

@router.get("/active", response_model=PomodoroResponse)
def get_active_pomodoro(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the currently active pomodoro for the current user"""
    pomodoro = svc_get_active(db, current_user.id)
    if not pomodoro:
        raise HTTPException(status_code=404, detail="No active pomodoro found")
    return pomodoro

@router.get("/stats")
def get_pomodoro_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pomodoro statistics for the current user"""
    return svc_get_stats(db, current_user.id)

@router.get("/{pomodoro_id}", response_model=PomodoroResponse)
def get_pomodoro(
    pomodoro_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific pomodoro by ID"""
    pomodoro = svc_get(db, pomodoro_id, current_user.id)
    if not pomodoro:
        raise HTTPException(status_code=404, detail="Pomodoro not found")
    return pomodoro

@router.post("", response_model=PomodoroResponse, status_code=201)
def create_pomodoro(
    payload: PomodoroCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new pomodoro"""
    return svc_create(db, payload, current_user.id)

@router.put("/{pomodoro_id}", response_model=PomodoroResponse)
def update_pomodoro(
    pomodoro_id: int,
    payload: PomodoroUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a pomodoro"""
    try:
        pomodoro = svc_update(db, pomodoro_id, payload, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{pomodoro_id}", status_code=204)
def delete_pomodoro(
    pomodoro_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a pomodoro"""
    try:
        success = svc_delete(db, pomodoro_id, current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{pomodoro_id}/start", response_model=PomodoroResponse)
def start_pomodoro(
    pomodoro_id: int,
    payload: PomodoroStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start a pomodoro timer"""
    try:
        pomodoro = svc_start(db, pomodoro_id, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{pomodoro_id}/pause", response_model=PomodoroResponse)
def pause_pomodoro(
    pomodoro_id: int,
    payload: PomodoroPause,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Pause a running pomodoro"""
    try:
        pomodoro = svc_pause(db, pomodoro_id, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{pomodoro_id}/resume", response_model=PomodoroResponse)
def resume_pomodoro(
    pomodoro_id: int,
    payload: PomodoroResume,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Resume a paused pomodoro"""
    try:
        pomodoro = svc_resume(db, pomodoro_id, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{pomodoro_id}/complete", response_model=PomodoroResponse)
def complete_pomodoro(
    pomodoro_id: int,
    payload: PomodoroComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Complete a pomodoro"""
    try:
        pomodoro = svc_complete(db, pomodoro_id, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{pomodoro_id}/cancel", response_model=PomodoroResponse)
def cancel_pomodoro(
    pomodoro_id: int,
    payload: PomodoroCancel,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel a pomodoro"""
    try:
        pomodoro = svc_cancel(db, pomodoro_id, current_user.id)
        if not pomodoro:
            raise HTTPException(status_code=404, detail="Pomodoro not found")
        return pomodoro
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
