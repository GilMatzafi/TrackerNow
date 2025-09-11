from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from app.db.base import Base
from app.models.calendar_event import CalendarEvent

# Use the same database URL as your main application
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_calendar_events_table():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Created calendar_events table successfully")
    except Exception as e:
        print(f"❌ Error creating calendar_events table: {e}")

if __name__ == "__main__":
    create_calendar_events_table()
