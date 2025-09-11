from pydantic import BaseModel, validator
from typing import Optional
from enum import Enum
from datetime import datetime

class PomodoroStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PomodoroType(str, Enum):
    WORK = "WORK"
    SHORT_BREAK = "SHORT_BREAK"
    LONG_BREAK = "LONG_BREAK"

class PomodoroBase(BaseModel):
    title: str
    description: Optional[str] = None
    pomodoro_type: PomodoroType = PomodoroType.WORK
    duration_minutes: int = 25

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Title must not be empty')
        return v.strip()

    @validator('duration_minutes')
    def duration_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Duration must be a positive number')
        if v > 120:  # Max 2 hours
            raise ValueError('Duration cannot exceed 120 minutes')
        return v

class PomodoroCreate(PomodoroBase):
    pass

class PomodoroUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    pomodoro_type: Optional[PomodoroType] = None
    duration_minutes: Optional[int] = None
    status: Optional[PomodoroStatus] = None

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Title must not be empty')
        return v.strip() if v else v

    @validator('duration_minutes')
    def duration_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Duration must be a positive number')
        if v is not None and v > 120:
            raise ValueError('Duration cannot exceed 120 minutes')
        return v

class PomodoroResponse(PomodoroBase):
    id: int
    user_id: int
    status: PomodoroStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    paused_duration_seconds: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PomodoroStart(BaseModel):
    """Schema for starting a pomodoro timer"""
    pass

class PomodoroPause(BaseModel):
    """Schema for pausing a pomodoro timer"""
    pass

class PomodoroResume(BaseModel):
    """Schema for resuming a pomodoro timer"""
    pass

class PomodoroComplete(BaseModel):
    """Schema for completing a pomodoro timer"""
    pass

class PomodoroCancel(BaseModel):
    """Schema for cancelling a pomodoro timer"""
    pass
