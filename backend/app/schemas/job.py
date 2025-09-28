from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# Contact schemas
class ContactBase(BaseModel):
    type: str = Field(..., description="Type of contact (recruiter, referrer, hiring_manager, etc.)")
    name: str = Field(..., description="Contact's full name")
    email: Optional[str] = Field(None, description="Contact's email address")
    linkedin: Optional[str] = Field(None, description="Contact's LinkedIn profile URL")


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None


class ContactResponse(ContactBase):
    id: int
    job_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Job schemas
class JobBase(BaseModel):
    company: str = Field(..., description="Company name")
    position: str = Field(..., description="Job position/title")
    location: Optional[str] = Field(None, description="Job location")
    salary: Optional[str] = Field(None, description="Salary information")
    note: Optional[str] = Field(None, description="Additional notes about the job")
    tags: Optional[List[str]] = Field(None, description="Tags for categorization")
    status: str = Field(default="saved", description="Job status: saved, applied, interview, rejected, offered")
    applied_date: Optional[datetime] = Field(None, description="Date when application was submitted")
    interview_time: Optional[datetime] = Field(None, description="Scheduled interview time")
    company_logo: Optional[str] = Field(None, description="Company logo URL")
    company_description: Optional[str] = Field(None, description="Company description")
    position_description: Optional[str] = Field(None, description="Position description")
    is_referral: bool = Field(default=False, description="Whether this is a referral")
    referrer_name: Optional[str] = Field(None, description="Name of the person who referred")
    cv: Optional[str] = Field(None, description="CV/Resume file path or URL")
    cover_letter: Optional[str] = Field(None, description="Cover letter file path or URL")
    application_url: Optional[str] = Field(None, description="Application URL (LinkedIn or career page)")
    completion_method: Optional[str] = Field(None, description="How the application was completed (linkedin, career_page, email, other)")


class JobCreate(JobBase):
    contacts: Optional[List[ContactCreate]] = Field(None, description="List of contacts for this job")


class JobUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    note: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    applied_date: Optional[datetime] = None
    interview_time: Optional[datetime] = None
    company_logo: Optional[str] = None
    company_description: Optional[str] = None
    position_description: Optional[str] = None
    is_referral: Optional[bool] = None
    referrer_name: Optional[str] = None
    cv: Optional[str] = None
    cover_letter: Optional[str] = None
    application_url: Optional[str] = None
    completion_method: Optional[str] = None


class JobResponse(JobBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    contacts: List[ContactResponse] = []

    class Config:
        from_attributes = True


# Bulk operations
class JobBulkUpdate(BaseModel):
    job_ids: List[int] = Field(..., description="List of job IDs to update")
    status: Optional[str] = Field(None, description="New status for all jobs")
    tags: Optional[List[str]] = Field(None, description="New tags for all jobs")


# Statistics
class JobStats(BaseModel):
    total_jobs: int
    jobs_by_status: dict
    jobs_by_company: dict
    recent_applications: int
    interview_rate: float
