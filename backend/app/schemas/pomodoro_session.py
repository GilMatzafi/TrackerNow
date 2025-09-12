from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PomodoroSessionBase(BaseModel):
    date: str  # YYYY-MM-DD format
    duration: int  # in minutes
    type: str  # 'work' or 'break'
    completed: bool = True

class CreatePomodoroSession(PomodoroSessionBase):
    pass

class UpdatePomodoroSession(BaseModel):
    date: Optional[str] = None
    duration: Optional[int] = None
    type: Optional[str] = None
    completed: Optional[bool] = None

class PomodoroSessionResponse(PomodoroSessionBase):
    id: int
    user_id: int
    completed_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
