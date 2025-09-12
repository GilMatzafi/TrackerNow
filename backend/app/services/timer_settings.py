from sqlalchemy.orm import Session
from app.models.timer_settings import TimerSettings
from app.schemas.timer_settings import CreateTimerSettings, UpdateTimerSettings
from typing import Optional


class TimerSettingsService:
    def __init__(self, db: Session):
        self.db = db

    def get_settings(self, user_id: int) -> Optional[TimerSettings]:
        """Get timer settings for a user"""
        return self.db.query(TimerSettings).filter(TimerSettings.user_id == user_id).first()

    def create_settings(self, user_id: int, settings_data: CreateTimerSettings) -> TimerSettings:
        """Create timer settings for a user"""
        db_settings = TimerSettings(
            user_id=user_id,
            focus_session=settings_data.focus_session,
            short_break=settings_data.short_break,
            long_break=settings_data.long_break,
            long_break_after=settings_data.long_break_after,
            sound_enabled=settings_data.sound_enabled,
            pause_start_sound=settings_data.pause_start_sound,
            focus_break_sound=settings_data.focus_break_sound
        )
        self.db.add(db_settings)
        self.db.commit()
        self.db.refresh(db_settings)
        return db_settings

    def update_settings(self, user_id: int, settings_data: UpdateTimerSettings) -> Optional[TimerSettings]:
        """Update timer settings for a user"""
        db_settings = self.get_settings(user_id)
        if not db_settings:
            return None

        update_data = settings_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_settings, field, value)

        self.db.commit()
        self.db.refresh(db_settings)
        return db_settings

    def get_or_create_settings(self, user_id: int) -> TimerSettings:
        """Get existing settings or create default ones"""
        settings = self.get_settings(user_id)
        if not settings:
            default_settings = CreateTimerSettings()
            settings = self.create_settings(user_id, default_settings)
        return settings
