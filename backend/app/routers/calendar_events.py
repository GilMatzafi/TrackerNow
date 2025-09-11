from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.api.deps import get_db, get_current_user
from app.schemas.calendar_event import CalendarEventResponse, CalendarEventCreate, CalendarEventUpdate
from app.services.calendar_events import CalendarEventService
from app.models.user import User

router = APIRouter(prefix="", tags=["calendar-events"])

@router.get("/", response_model=List[CalendarEventResponse])
def get_calendar_events(
    start_date: Optional[date] = Query(None, description="Start date for filtering events"),
    end_date: Optional[date] = Query(None, description="End date for filtering events"),
    year: Optional[int] = Query(None, description="Year for month filtering"),
    month: Optional[int] = Query(None, description="Month for month filtering"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get calendar events for the current user with optional date filtering."""
    service = CalendarEventService(db)
    
    if year and month:
        events = service.get_events_by_month(current_user.id, year, month)
    else:
        events = service.get_events(current_user.id, start_date, end_date)
    
    return events

@router.post("/", response_model=CalendarEventResponse, status_code=status.HTTP_201_CREATED)
def create_calendar_event(
    event_data: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new calendar event for the current user."""
    service = CalendarEventService(db)
    event = service.create_event(event_data, current_user.id)
    return event

@router.get("/{event_id}", response_model=CalendarEventResponse)
def get_calendar_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific calendar event by ID for the current user."""
    service = CalendarEventService(db)
    event = service.get_event(event_id, current_user.id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=CalendarEventResponse)
def update_calendar_event(
    event_id: int,
    event_data: CalendarEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing calendar event by ID for the current user."""
    service = CalendarEventService(db)
    event = service.update_event(event_id, current_user.id, event_data)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calendar_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a calendar event by ID for the current user."""
    service = CalendarEventService(db)
    if not service.delete_event(event_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return
