from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List
from enum import Enum
from datetime import datetime

class ApplicationStatus(str, Enum):
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

class ApplicationSource(str, Enum):
    LINKEDIN = "LinkedIn"
    COMPANY_WEBSITE = "Company Website"
    REFERRAL = "Referral"
    JOB_BOARD = "Job Board"
    RECRUITER = "Recruiter"
    NETWORKING = "Networking"
    OTHER = "Other"

class InterviewStage(str, Enum):
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

class InterviewStageDetail(BaseModel):
    stage: InterviewStage
    date: Optional[datetime] = None
    notes: Optional[str] = None
    status: str = "Scheduled"  # Scheduled, Completed, Cancelled, Passed, Failed

class ApplicationBase(BaseModel):
    job_title: str
    company_name: str
    role_position: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    application_status: ApplicationStatus = ApplicationStatus.DRAFT
    application_date: Optional[datetime] = None
    job_link: Optional[HttpUrl] = None
    notes: Optional[str] = None
    submitted_resume: bool = False
    contact_person_name: Optional[str] = None
    contact_person_email: Optional[str] = None
    application_source: Optional[ApplicationSource] = None
    source_details: Optional[str] = None
    interview_stages: List[InterviewStageDetail] = []

    @validator('job_title')
    def job_title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Job title must not be empty')
        return v.strip()

    @validator('company_name')
    def company_name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Company name must not be empty')
        return v.strip()

    @validator('contact_person_email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    role_position: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    application_status: Optional[ApplicationStatus] = None
    application_date: Optional[datetime] = None
    job_link: Optional[HttpUrl] = None
    notes: Optional[str] = None
    submitted_resume: Optional[bool] = None
    contact_person_name: Optional[str] = None
    contact_person_email: Optional[str] = None
    application_source: Optional[ApplicationSource] = None
    source_details: Optional[str] = None
    interview_stages: Optional[List[InterviewStageDetail]] = None

    @validator('job_title')
    def job_title_must_not_be_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Job title must not be empty')
        return v.strip() if v else v

    @validator('company_name')
    def company_name_must_not_be_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Company name must not be empty')
        return v.strip() if v else v

    @validator('contact_person_email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v

class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
