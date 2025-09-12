from sqlalchemy.orm import Session
from app.models.pomodoro_session import PomodoroSession
from app.schemas.pomodoro_session import CreatePomodoroSession, UpdatePomodoroSession
from typing import List, Optional
from datetime import datetime, timedelta

class PomodoroSessionService:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, user_id: int, session_data: CreatePomodoroSession) -> PomodoroSession:
        """Create a new pomodoro session"""
        db_session = PomodoroSession(
            user_id=user_id,
            **session_data.dict()
        )
        self.db.add(db_session)
        self.db.commit()
        self.db.refresh(db_session)
        return db_session

    def get_sessions(self, user_id: int, skip: int = 0, limit: int = 100) -> List[PomodoroSession]:
        """Get all pomodoro sessions for a user"""
        return self.db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id
        ).offset(skip).limit(limit).all()

    def get_session(self, user_id: int, session_id: int) -> Optional[PomodoroSession]:
        """Get a specific pomodoro session"""
        return self.db.query(PomodoroSession).filter(
            PomodoroSession.id == session_id,
            PomodoroSession.user_id == user_id
        ).first()

    def get_weekly_sessions(self, user_id: int) -> List[PomodoroSession]:
        """Get pomodoro sessions for the current week"""
        today = datetime.now().date()
        # Get Monday of current week
        monday = today - timedelta(days=today.weekday())
        week_start = monday.strftime('%Y-%m-%d')
        week_end = (monday + timedelta(days=6)).strftime('%Y-%m-%d')
        
        return self.db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id,
            PomodoroSession.date >= week_start,
            PomodoroSession.date <= week_end
        ).all()

    def get_today_sessions(self, user_id: int) -> List[PomodoroSession]:
        """Get pomodoro sessions for today"""
        today = datetime.now().date().strftime('%Y-%m-%d')
        return self.db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id,
            PomodoroSession.date == today
        ).all()

    def get_today_work_sessions(self, user_id: int) -> List[PomodoroSession]:
        """Get completed work sessions for today"""
        today = datetime.now().date().strftime('%Y-%m-%d')
        return self.db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id,
            PomodoroSession.date == today,
            PomodoroSession.type == 'work',
            PomodoroSession.completed == True
        ).all()

    def get_total_work_time(self, user_id: int) -> int:
        """Get total work time in minutes for all sessions"""
        sessions = self.db.query(PomodoroSession).filter(
            PomodoroSession.user_id == user_id,
            PomodoroSession.type == 'work',
            PomodoroSession.completed == True
        ).all()
        return sum(session.duration for session in sessions)

    def get_today_work_time(self, user_id: int) -> int:
        """Get total work time in minutes for today"""
        sessions = self.get_today_work_sessions(user_id)
        return sum(session.duration for session in sessions)

    def update_session(self, user_id: int, session_id: int, session_data: UpdatePomodoroSession) -> Optional[PomodoroSession]:
        """Update a pomodoro session"""
        db_session = self.get_session(user_id, session_id)
        if not db_session:
            return None
        
        update_data = session_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_session, field, value)
        
        self.db.commit()
        self.db.refresh(db_session)
        return db_session

    def delete_session(self, user_id: int, session_id: int) -> bool:
        """Delete a pomodoro session"""
        db_session = self.get_session(user_id, session_id)
        if not db_session:
            return False
        
        self.db.delete(db_session)
        self.db.commit()
        return True
