from sqlalchemy import Integer, String, Text, JSON, Enum, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
import enum
from datetime import datetime

class ApplicationStatus(enum.Enum):
    DRAFT = "Draft"
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    PHONE_SCREENING = "Phone Screening"
    TECHNICAL_INTERVIEW = "Technical Interview"
    HR_INTERVIEW = "HR Interview"
    FINAL_INTERVIEW = "Final Interview"
    OFFER_RECEIVED = "Offer Received"
    OFFER_ACCEPTED = "Offer Accepted"
    OFFER_DECLINED = "Offer Declined"
    REJECTED = "Rejected"
    WITHDRAWN = "Withdrawn"

class ApplicationSource(enum.Enum):
    LINKEDIN = "LinkedIn"
    COMPANY_WEBSITE = "Company Website"
    REFERRAL = "Referral"
    JOB_BOARD = "Job Board"
    RECRUITER = "Recruiter"
    NETWORKING = "Networking"
    OTHER = "Other"

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
