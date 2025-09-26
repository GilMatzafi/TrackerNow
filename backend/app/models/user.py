from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_seed = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    problems = relationship("Problem", back_populates="user")
    pomodoros = relationship("Pomodoro", back_populates="user")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="user")
    onboarding_tasks = relationship("OnboardingTask", back_populates="user")
    calendar_events = relationship("CalendarEvent", back_populates="user")
    timer_settings = relationship("TimerSettings", back_populates="user", uselist=False)
    jobs = relationship("Job", back_populates="user")
