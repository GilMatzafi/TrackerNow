from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.services.applications import (
    list_applications as svc_list,
    create_application as svc_create,
    get_application as svc_get,
    update_application as svc_update,
    delete_application as svc_delete,
    get_applications_by_status,
    get_applications_by_company,
    get_applications_by_industry,
    search_applications
)

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("", response_model=list[ApplicationResponse])
def list_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: str = Query(None, description="Filter by application status"),
    company: str = Query(None, description="Filter by company name"),
    industry: str = Query(None, description="Filter by industry"),
    search: str = Query(None, description="Search in job title, company, role, industry, location"),
    db: Session = Depends(get_db)
):
    """Get all applications with optional filtering and search."""
    if search:
        return search_applications(db, search, skip=skip, limit=limit)
    elif status:
        return get_applications_by_status(db, status, skip=skip, limit=limit)
    elif company:
        return get_applications_by_company(db, company, skip=skip, limit=limit)
    elif industry:
        return get_applications_by_industry(db, industry, skip=skip, limit=limit)
    else:
        return svc_list(db, skip=skip, limit=limit)

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    """Get a specific application by ID."""
    application = svc_get(db, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.post("", response_model=ApplicationResponse, status_code=201)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    """Create a new job application."""
    return svc_create(db, payload)

@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing application."""
    application = svc_update(db, application_id, payload)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.delete("/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    """Delete an application."""
    success = svc_delete(db, application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    return None

@router.get("/stats/summary")
def get_application_stats(db: Session = Depends(get_db)):
    """Get application statistics summary."""
    from sqlalchemy import func
    from app.models.application import Application, ApplicationStatus
    
    # Total applications
    total_applications = db.query(Application).count()
    
    # Applications by status
    status_counts = db.query(
        Application.application_status,
        func.count(Application.id).label('count')
    ).group_by(Application.application_status).all()
    
    # Applications by industry
    industry_counts = db.query(
        Application.industry,
        func.count(Application.id).label('count')
    ).filter(Application.industry.isnot(None)).group_by(Application.industry).all()
    
    # Recent applications (last 30 days)
    from datetime import datetime, timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_applications = db.query(Application).filter(
        Application.created_at >= thirty_days_ago
    ).count()
    
    return {
        "total_applications": total_applications,
        "recent_applications": recent_applications,
        "status_breakdown": {status.value: count for status, count in status_counts},
        "industry_breakdown": {industry: count for industry, count in industry_counts if industry}
    }
