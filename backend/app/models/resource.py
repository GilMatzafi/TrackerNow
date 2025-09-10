from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum
from datetime import datetime
from typing import Optional

class ResourceType(enum.Enum):
    BOOK = "BOOK"
    VIDEO = "VIDEO"
    ARTICLE = "ARTICLE"
    COURSE = "COURSE"
    PODCAST = "PODCAST"
    TUTORIAL = "TUTORIAL"
    DOCUMENTATION = "DOCUMENTATION"
    OTHER = "OTHER"

class ResourceStatus(enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    PAUSED = "PAUSED"
    ABANDONED = "ABANDONED"

class ResourcePriority(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class ResourceCategory(enum.Enum):
    PROGRAMMING = "PROGRAMMING"
    ALGORITHMS = "ALGORITHMS"
    DATA_STRUCTURES = "DATA_STRUCTURES"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    DATABASE = "DATABASE"
    WEB_DEVELOPMENT = "WEB_DEVELOPMENT"
    MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT"
    DEVOPS = "DEVOPS"
    MACHINE_LEARNING = "MACHINE_LEARNING"
    CYBERSECURITY = "CYBERSECURITY"
    SOFT_SKILLS = "SOFT_SKILLS"
    CAREER_DEVELOPMENT = "CAREER_DEVELOPMENT"
    INTERVIEW_PREP = "INTERVIEW_PREP"
    OTHER = "OTHER"

class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    # Basic Information
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    isbn: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    publisher: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    publication_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    pages: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Resource Details
    resource_type: Mapped[ResourceType] = mapped_column(Enum(ResourceType), default=ResourceType.BOOK, nullable=False)
    category: Mapped[ResourceCategory] = mapped_column(Enum(ResourceCategory), nullable=True)
    status: Mapped[ResourceStatus] = mapped_column(Enum(ResourceStatus), default=ResourceStatus.NOT_STARTED, nullable=False)
    priority: Mapped[ResourcePriority] = mapped_column(Enum(ResourcePriority), default=ResourcePriority.MEDIUM, nullable=False)

    # Progress Tracking
    current_page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_pages: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    progress_percentage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completion_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Additional Information
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # 1-5 stars
    tags: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array of tags
    purchase_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="books")

class Video(Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    # Basic Information
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    creator: Mapped[str] = mapped_column(String(255), nullable=False)  # YouTuber, instructor, etc.
    channel: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    platform: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # YouTube, Udemy, Coursera, etc.

    # Resource Details
    resource_type: Mapped[ResourceType] = mapped_column(Enum(ResourceType), default=ResourceType.VIDEO, nullable=False)
    category: Mapped[ResourceCategory] = mapped_column(Enum(ResourceCategory), nullable=True)
    status: Mapped[ResourceStatus] = mapped_column(Enum(ResourceStatus), default=ResourceStatus.NOT_STARTED, nullable=False)
    priority: Mapped[ResourcePriority] = mapped_column(Enum(ResourcePriority), default=ResourcePriority.MEDIUM, nullable=False)

    # Video Details
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    video_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # YouTube video ID, etc.

    # Progress Tracking
    current_time_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    progress_percentage: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completion_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    watch_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # How many times watched

    # Additional Information
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # 1-5 stars
    tags: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON array of tags
    playlist: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # If part of a series/playlist
    difficulty_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Beginner, Intermediate, Advanced

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="videos")
