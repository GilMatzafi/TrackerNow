from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Basic job information
    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    salary = Column(String(100), nullable=True)
    note = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # Array of strings stored as JSON
    
    # Status and dates
    status = Column(String(50), nullable=False, default="saved")  # saved, applied, interview, rejected, offered
    applied_date = Column(DateTime, nullable=True)
    interview_time = Column(DateTime, nullable=True)
    
    # Company and position details
    company_logo = Column(String(500), nullable=True)
    company_description = Column(Text, nullable=True)
    position_description = Column(Text, nullable=True)
    
    # Referral information
    is_referral = Column(Boolean, default=False)
    referrer_name = Column(String(255), nullable=True)
    
    # CV/Resume
    cv = Column(String(500), nullable=True)  # File path or URL
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    contacts = relationship("Contact", back_populates="job", cascade="all, delete-orphan")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    
    # Contact information
    type = Column(String(50), nullable=False)  # recruiter, referrer, hiring_manager, etc.
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    linkedin = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="contacts")
