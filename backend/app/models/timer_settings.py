from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class TimerSettings(Base):
    __tablename__ = "timer_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Duration settings
    focus_session = Column(Integer, default=25, nullable=False)
    short_break = Column(Integer, default=5, nullable=False)
    long_break = Column(Integer, default=15, nullable=False)
    long_break_after = Column(Integer, default=4, nullable=False)
    
    # Sound settings
    sound_enabled = Column(Boolean, default=True, nullable=False)
    pause_start_sound = Column(Boolean, default=True, nullable=False)
    focus_break_sound = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="timer_settings")
