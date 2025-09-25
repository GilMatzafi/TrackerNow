from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.problem import ProblemCreate, ProblemUpdate, ProblemResponse
from app.schemas.problem_autofill import ProblemAutoFillRequest, ProblemAutoFillResponse
from app.services.problems import (
    list_problems as svc_list, 
    create_problem as svc_create,
    get_problem as svc_get,
    update_problem as svc_update,
    delete_problem as svc_delete
)
from app.services.problem_autofill import problem_autofill_service

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("", response_model=list[ProblemResponse])
def list_problems(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return svc_list(db, current_user.id, skip=skip, limit=limit)

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = svc_get(db, problem_id, current_user.id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("", response_model=ProblemResponse, status_code=201)
def create_problem(
    payload: ProblemCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return svc_create(db, payload, current_user.id)

@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: int, 
    payload: ProblemUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = svc_update(db, problem_id, payload, current_user.id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.delete("/{problem_id}", status_code=204)
def delete_problem(
    problem_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = svc_delete(db, problem_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Problem not found")
    return None

@router.post("/autofill", response_model=ProblemAutoFillResponse)
def autofill_problem_details(
    request: ProblemAutoFillRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Auto-fill problem details from various coding platforms
    """
    try:
        if not request.problem_name or len(request.problem_name.strip()) < 2:
            return ProblemAutoFillResponse(
                success=False,
                error="Problem name must be at least 2 characters long"
            )
        
        # Extract problem details
        details = problem_autofill_service.extract_problem_details(request.problem_name.strip())
        
        if details:
            return ProblemAutoFillResponse(
                success=True,
                data=details
            )
        else:
            return ProblemAutoFillResponse(
                success=False,
                error="No matching problem found on supported platforms"
            )
            
    except Exception as e:
        return ProblemAutoFillResponse(
            success=False,
            error=f"Error fetching problem details: {str(e)}"
        )

