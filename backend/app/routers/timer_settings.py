from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.timer_settings import TimerSettingsService
from app.schemas.timer_settings import TimerSettingsResponse, UpdateTimerSettings
from typing import Dict, Any

router = APIRouter()


@router.get("/", response_model=TimerSettingsResponse)
def get_timer_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's timer settings"""
    service = TimerSettingsService(db)
    settings = service.get_or_create_settings(current_user.id)
    return settings


@router.put("/", response_model=TimerSettingsResponse)
def update_timer_settings(
    settings_data: UpdateTimerSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's timer settings"""
    service = TimerSettingsService(db)
    
    # Get or create settings first
    settings = service.get_or_create_settings(current_user.id)
    
    # Update the settings
    updated_settings = service.update_settings(current_user.id, settings_data)
    if not updated_settings:
        raise HTTPException(status_code=404, detail="Timer settings not found")
    
    return updated_settings


@router.get("/defaults", response_model=Dict[str, Any])
def get_default_settings():
    """Get default timer settings"""
    return {
        "focus_session": 25,
        "short_break": 5,
        "long_break": 15,
        "long_break_after": 4,
        "sound_enabled": True,
        "pause_start_sound": True,
        "focus_break_sound": True
    }
