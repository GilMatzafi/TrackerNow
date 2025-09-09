from sqlalchemy import Integer, String, Text, JSON, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
import enum
from datetime import datetime

class DifficultyLevel(enum.Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    topics: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    difficulty: Mapped[DifficultyLevel] = mapped_column(Enum(DifficultyLevel), nullable=False)
    link: Mapped[str] = mapped_column(String(500), nullable=True)
    time_minutes: Mapped[int] = mapped_column(Integer, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)  
