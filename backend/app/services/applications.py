from sqlalchemy.orm import Session
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate, InterviewStageDetail
from typing import Optional, List
from datetime import datetime

def list_applications(db: Session, skip: int = 0, limit: int = 100) -> List[Application]:
    return db.query(Application).offset(skip).limit(limit).all()

def get_application(db: Session, application_id: int) -> Optional[Application]:
    return db.query(Application).filter(Application.id == application_id).first()

def create_application(db: Session, payload: ApplicationCreate) -> Application:
    # Convert interview stages to dict format for JSON storage
    interview_stages_data = []
    for stage in payload.interview_stages:
        stage_data = {
            "stage": stage.stage.value,
            "date": stage.date.isoformat() if stage.date else None,
            "notes": stage.notes,
            "status": stage.status
        }
        interview_stages_data.append(stage_data)
    
    obj = Application(
        job_title=payload.job_title,
        company_name=payload.company_name,
        role_position=payload.role_position,
        industry=payload.industry,
        location=payload.location,
        application_status=payload.application_status,
        application_date=payload.application_date,
        job_link=str(payload.job_link) if payload.job_link else None,
        notes=payload.notes,
        submitted_resume=payload.submitted_resume,
        contact_person_name=payload.contact_person_name,
        contact_person_email=payload.contact_person_email,
        application_source=payload.application_source,
        source_details=payload.source_details,
        interview_stages=interview_stages_data
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_application(db: Session, application_id: int, payload: ApplicationUpdate) -> Optional[Application]:
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        return None
    
    update_data = payload.dict(exclude_unset=True)
    
    # Handle job_link conversion
    if 'job_link' in update_data and update_data['job_link']:
        update_data['job_link'] = str(update_data['job_link'])
    
    # Handle interview stages conversion
    if 'interview_stages' in update_data:
        interview_stages_data = []
        for stage in update_data['interview_stages']:
            stage_data = {
                "stage": stage.stage.value,
                "date": stage.date.isoformat() if stage.date else None,
                "notes": stage.notes,
                "status": stage.status
            }
            interview_stages_data.append(stage_data)
        update_data['interview_stages'] = interview_stages_data
    
    for field, value in update_data.items():
        setattr(application, field, value)
    
    # Update the updated_at timestamp
    application.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    return application

def delete_application(db: Session, application_id: int) -> bool:
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        return False
    
    db.delete(application)
    db.commit()
    return True

def get_applications_by_status(db: Session, status: str, skip: int = 0, limit: int = 100) -> List[Application]:
    return db.query(Application).filter(Application.application_status == status).offset(skip).limit(limit).all()

def get_applications_by_company(db: Session, company_name: str, skip: int = 0, limit: int = 100) -> List[Application]:
    return db.query(Application).filter(Application.company_name.ilike(f"%{company_name}%")).offset(skip).limit(limit).all()

def get_applications_by_industry(db: Session, industry: str, skip: int = 0, limit: int = 100) -> List[Application]:
    return db.query(Application).filter(Application.industry.ilike(f"%{industry}%")).offset(skip).limit(limit).all()

def search_applications(db: Session, search_term: str, skip: int = 0, limit: int = 100) -> List[Application]:
    return db.query(Application).filter(
        (Application.job_title.ilike(f"%{search_term}%")) |
        (Application.company_name.ilike(f"%{search_term}%")) |
        (Application.role_position.ilike(f"%{search_term}%")) |
        (Application.industry.ilike(f"%{search_term}%")) |
        (Application.location.ilike(f"%{search_term}%"))
    ).offset(skip).limit(limit).all()
