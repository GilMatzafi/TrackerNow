from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.jobs import JobService
from app.schemas.job import (
    JobCreate, 
    JobUpdate, 
    JobResponse, 
    ContactCreate, 
    ContactResponse,
    JobBulkUpdate,
    JobStats
)

router = APIRouter()


@router.post("/", response_model=JobResponse)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new job application"""
    job_service = JobService(db)
    job = job_service.create_job(current_user.id, job_data)
    return job


@router.get("/", response_model=List[JobResponse])
def get_jobs(
    status: Optional[str] = Query(None, description="Filter by job status"),
    limit: int = Query(100, ge=1, le=1000, description="Number of jobs to return"),
    offset: int = Query(0, ge=0, description="Number of jobs to skip"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all jobs for the current user, optionally filtered by status"""
    job_service = JobService(db)
    jobs = job_service.get_jobs(current_user.id, status, limit, offset)
    return jobs


@router.get("/stats", response_model=JobStats)
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get job statistics for the current user"""
    job_service = JobService(db)
    stats = job_service.get_job_stats(current_user.id)
    return stats


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific job by ID"""
    job_service = JobService(db)
    job = job_service.get_job(current_user.id, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a job application"""
    job_service = JobService(db)
    job = job_service.update_job(current_user.id, job_id, job_data)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a job application"""
    job_service = JobService(db)
    success = job_service.delete_job(current_user.id, job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}


@router.patch("/bulk-update")
def bulk_update_jobs(
    bulk_data: JobBulkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bulk update multiple jobs"""
    job_service = JobService(db)
    updated_count = job_service.bulk_update_jobs(current_user.id, bulk_data)
    return {"message": f"Updated {updated_count} jobs successfully"}


# Contact endpoints
@router.post("/{job_id}/contacts", response_model=ContactResponse)
def add_contact(
    job_id: int,
    contact_data: ContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a contact to a job"""
    job_service = JobService(db)
    contact = job_service.add_contact(current_user.id, job_id, contact_data)
    if not contact:
        raise HTTPException(status_code=404, detail="Job not found")
    return contact


@router.put("/{job_id}/contacts/{contact_id}", response_model=ContactResponse)
def update_contact(
    job_id: int,
    contact_id: int,
    contact_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a contact"""
    job_service = JobService(db)
    contact = job_service.update_contact(current_user.id, job_id, contact_id, contact_data)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.delete("/{job_id}/contacts/{contact_id}")
def delete_contact(
    job_id: int,
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a contact"""
    job_service = JobService(db)
    success = job_service.delete_contact(current_user.id, job_id, contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}
