from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TimerSettingsBase(BaseModel):
    focus_session: int = 25
    short_break: int = 5
    long_break: int = 15
    long_break_after: int = 4
    sound_enabled: bool = True
    pause_start_sound: bool = True
    focus_break_sound: bool = True


class CreateTimerSettings(TimerSettingsBase):
    pass


class UpdateTimerSettings(BaseModel):
    focus_session: Optional[int] = None
    short_break: Optional[int] = None
    long_break: Optional[int] = None
    long_break_after: Optional[int] = None
    sound_enabled: Optional[bool] = None
    pause_start_sound: Optional[bool] = None
    focus_break_sound: Optional[bool] = None


class TimerSettingsResponse(TimerSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
