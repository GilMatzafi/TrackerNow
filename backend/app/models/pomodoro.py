from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum
from datetime import datetime

class PomodoroStatus(enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PomodoroType(enum.Enum):
    WORK = "WORK"
    SHORT_BREAK = "SHORT_BREAK"
    LONG_BREAK = "LONG_BREAK"

class Pomodoro(Base):
    __tablename__ = "pomodoros"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    pomodoro_type: Mapped[PomodoroType] = mapped_column(Enum(PomodoroType), default=PomodoroType.WORK, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=25, nullable=False)  # Default 25 minutes for work
    status: Mapped[PomodoroStatus] = mapped_column(Enum(PomodoroStatus), default=PomodoroStatus.PENDING, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    paused_duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # Track total paused time
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="pomodoros")
