from sqlalchemy.orm import Session
from app.models.calendar_event import CalendarEvent
from app.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate
from typing import List
from datetime import datetime, date

class CalendarEventService:
    def __init__(self, db: Session):
        self.db = db

    def get_events(self, user_id: int, start_date: date = None, end_date: date = None) -> List[CalendarEvent]:
        """Get all calendar events for a user, optionally filtered by date range."""
        query = self.db.query(CalendarEvent).filter(CalendarEvent.user_id == user_id)
        
        if start_date:
            query = query.filter(CalendarEvent.start_time >= start_date)
        if end_date:
            query = query.filter(CalendarEvent.end_time <= end_date)
            
        return query.order_by(CalendarEvent.start_time.asc()).all()

    def get_events_by_month(self, user_id: int, year: int, month: int) -> List[CalendarEvent]:
        """Get all calendar events for a specific month."""
        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)
            
        return self.get_events(user_id, start_date, end_date)

    def get_event(self, event_id: int, user_id: int) -> CalendarEvent | None:
        """Get a specific calendar event by ID for a user."""
        return self.db.query(CalendarEvent).filter(
            CalendarEvent.id == event_id, 
            CalendarEvent.user_id == user_id
        ).first()

    def create_event(self, event_data: CalendarEventCreate, user_id: int) -> CalendarEvent:
        """Create a new calendar event for a user."""
        db_event = CalendarEvent(**event_data.dict(), user_id=user_id)
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def update_event(self, event_id: int, user_id: int, event_data: CalendarEventUpdate) -> CalendarEvent | None:
        """Update an existing calendar event."""
        db_event = self.get_event(event_id, user_id)
        if db_event:
            update_data = event_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_event, key, value)
            self.db.commit()
            self.db.refresh(db_event)
        return db_event

    def delete_event(self, event_id: int, user_id: int) -> bool:
        """Delete a calendar event."""
        db_event = self.get_event(event_id, user_id)
        if db_event:
            self.db.delete(db_event)
            self.db.commit()
            return True
        return False
