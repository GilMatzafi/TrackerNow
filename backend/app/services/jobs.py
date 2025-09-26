from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from typing import List, Optional
from app.models.job import Job, Contact
from app.schemas.job import JobCreate, JobUpdate, ContactCreate, JobBulkUpdate, JobStats
from datetime import datetime, timedelta


class JobService:
    def __init__(self, db: Session):
        self.db = db

    def create_job(self, user_id: int, job_data: JobCreate) -> Job:
        """Create a new job application"""
        # Create the job
        job = Job(
            user_id=user_id,
            company=job_data.company,
            position=job_data.position,
            location=job_data.location,
            salary=job_data.salary,
            note=job_data.note,
            tags=job_data.tags,
            status=job_data.status,
            applied_date=job_data.applied_date,
            interview_time=job_data.interview_time,
            company_logo=job_data.company_logo,
            company_description=job_data.company_description,
            position_description=job_data.position_description,
            is_referral=job_data.is_referral,
            referrer_name=job_data.referrer_name,
            cv=job_data.cv
        )
        
        self.db.add(job)
        self.db.flush()  # Get the job ID
        
        # Create contacts if provided
        if job_data.contacts:
            for contact_data in job_data.contacts:
                contact = Contact(
                    job_id=job.id,
                    type=contact_data.type,
                    name=contact_data.name,
                    email=contact_data.email,
                    linkedin=contact_data.linkedin
                )
                self.db.add(contact)
        
        self.db.commit()
        self.db.refresh(job)
        return job

    def get_jobs(self, user_id: int, status: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Job]:
        """Get all jobs for a user, optionally filtered by status"""
        query = self.db.query(Job).filter(Job.user_id == user_id)
        
        if status:
            query = query.filter(Job.status == status)
        
        return query.order_by(desc(Job.created_at)).offset(offset).limit(limit).all()

    def get_job(self, user_id: int, job_id: int) -> Optional[Job]:
        """Get a specific job by ID"""
        return self.db.query(Job).filter(
            and_(Job.id == job_id, Job.user_id == user_id)
        ).first()

    def update_job(self, user_id: int, job_id: int, job_data: JobUpdate) -> Optional[Job]:
        """Update a job application"""
        job = self.get_job(user_id, job_id)
        if not job:
            return None
        
        # Update fields
        update_data = job_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(job, field, value)
        
        job.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(job)
        return job

    def delete_job(self, user_id: int, job_id: int) -> bool:
        """Delete a job application"""
        job = self.get_job(user_id, job_id)
        if not job:
            return False
        
        self.db.delete(job)
        self.db.commit()
        return True

    def bulk_update_jobs(self, user_id: int, bulk_data: JobBulkUpdate) -> int:
        """Bulk update multiple jobs"""
        update_data = bulk_data.dict(exclude_unset=True, exclude={'job_ids'})
        if not update_data:
            return 0
        
        # Update the timestamp
        update_data['updated_at'] = datetime.utcnow()
        
        # Perform bulk update
        result = self.db.query(Job).filter(
            and_(
                Job.id.in_(bulk_data.job_ids),
                Job.user_id == user_id
            )
        ).update(update_data, synchronize_session=False)
        
        self.db.commit()
        return result

    def get_job_stats(self, user_id: int) -> JobStats:
        """Get job statistics for a user"""
        # Total jobs
        total_jobs = self.db.query(Job).filter(Job.user_id == user_id).count()
        
        # Jobs by status
        status_counts = self.db.query(
            Job.status, 
            func.count(Job.id).label('count')
        ).filter(Job.user_id == user_id).group_by(Job.status).all()
        
        jobs_by_status = {status: count for status, count in status_counts}
        
        # Jobs by company (top 10)
        company_counts = self.db.query(
            Job.company,
            func.count(Job.id).label('count')
        ).filter(Job.user_id == user_id).group_by(Job.company).order_by(
            desc('count')
        ).limit(10).all()
        
        jobs_by_company = {company: count for company, count in company_counts}
        
        # Recent applications (last 30 days)
        thirty_days_ago = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=30)
        
        recent_applications = self.db.query(Job).filter(
            and_(
                Job.user_id == user_id,
                Job.applied_date >= thirty_days_ago
            )
        ).count()
        
        # Interview rate (interviews / applied jobs)
        applied_count = jobs_by_status.get('applied', 0)
        interview_count = jobs_by_status.get('interview', 0)
        interview_rate = (interview_count / applied_count * 100) if applied_count > 0 else 0
        
        return JobStats(
            total_jobs=total_jobs,
            jobs_by_status=jobs_by_status,
            jobs_by_company=jobs_by_company,
            recent_applications=recent_applications,
            interview_rate=round(interview_rate, 2)
        )

    def add_contact(self, user_id: int, job_id: int, contact_data: ContactCreate) -> Optional[Contact]:
        """Add a contact to a job"""
        job = self.get_job(user_id, job_id)
        if not job:
            return None
        
        contact = Contact(
            job_id=job_id,
            type=contact_data.type,
            name=contact_data.name,
            email=contact_data.email,
            linkedin=contact_data.linkedin
        )
        
        self.db.add(contact)
        self.db.commit()
        self.db.refresh(contact)
        return contact

    def update_contact(self, user_id: int, job_id: int, contact_id: int, contact_data: dict) -> Optional[Contact]:
        """Update a contact"""
        # Verify the job belongs to the user
        job = self.get_job(user_id, job_id)
        if not job:
            return None
        
        contact = self.db.query(Contact).filter(
            and_(Contact.id == contact_id, Contact.job_id == job_id)
        ).first()
        
        if not contact:
            return None
        
        # Update fields
        for field, value in contact_data.items():
            if hasattr(contact, field):
                setattr(contact, field, value)
        
        contact.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(contact)
        return contact

    def delete_contact(self, user_id: int, job_id: int, contact_id: int) -> bool:
        """Delete a contact"""
        # Verify the job belongs to the user
        job = self.get_job(user_id, job_id)
        if not job:
            return False
        
        contact = self.db.query(Contact).filter(
            and_(Contact.id == contact_id, Contact.job_id == job_id)
        ).first()
        
        if not contact:
            return False
        
        self.db.delete(contact)
        self.db.commit()
        return True
