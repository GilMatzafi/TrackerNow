from sqlalchemy import Integer, String, Text, JSON, Enum, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum
from datetime import datetime

class ApplicationStatus(enum.Enum):
    DRAFT = "DRAFT"
    APPLIED = "APPLIED"
    UNDER_REVIEW = "UNDER_REVIEW"
    PHONE_SCREENING = "PHONE_SCREENING"
    TECHNICAL_INTERVIEW = "TECHNICAL_INTERVIEW"
    HR_INTERVIEW = "HR_INTERVIEW"
    FINAL_INTERVIEW = "FINAL_INTERVIEW"
    OFFER_RECEIVED = "OFFER_RECEIVED"
    OFFER_ACCEPTED = "OFFER_ACCEPTED"
    OFFER_DECLINED = "OFFER_DECLINED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"

class ApplicationSource(enum.Enum):
    LINKEDIN = "LINKEDIN"
    COMPANY_WEBSITE = "COMPANY_WEBSITE"
    REFERRAL = "REFERRAL"
    JOB_BOARD = "JOB_BOARD"
    RECRUITER = "RECRUITER"
    NETWORKING = "NETWORKING"
    OTHER = "OTHER"

class InterviewStage(enum.Enum):
    PHONE_SCREENING = "Phone Screening"
    TECHNICAL_ASSESSMENT = "Technical Assessment"
    CODING_CHALLENGE = "Coding Challenge"
    TECHNICAL_INTERVIEW = "Technical Interview"
    SYSTEM_DESIGN = "System Design"
    HR_INTERVIEW = "HR Interview"
    BEHAVIORAL_INTERVIEW = "Behavioral Interview"
    FINAL_INTERVIEW = "Final Interview"
    PANEL_INTERVIEW = "Panel Interview"
    OTHER = "Other"

class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic Job Information
    job_title: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role_position: Mapped[str] = mapped_column(String(255), nullable=True)
    industry: Mapped[str] = mapped_column(String(255), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Application Details
    application_status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus), default=ApplicationStatus.DRAFT, nullable=False)
    application_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    job_link: Mapped[str] = mapped_column(String(500), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Resume and Contact Information
    submitted_resume: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    contact_person_name: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_person_email: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Application Source
    application_source: Mapped[ApplicationSource] = mapped_column(Enum(ApplicationSource), nullable=True)
    source_details: Mapped[str] = mapped_column(String(500), nullable=True)  # Additional details about the source
    
    # Interview Stages (stored as JSON array)
    interview_stages: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="applications")
