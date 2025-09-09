from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.problem import ProblemCreate, ProblemResponse
from app.services.problems import list_problems as svc_list, create_problem as svc_create

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("", response_model=list[ProblemResponse])
def list_problems(db: Session = Depends(get_db)):
    return svc_list(db)

@router.post("", response_model=ProblemResponse, status_code=201)
def create_problem(payload: ProblemCreate, db: Session = Depends(get_db)):
    return svc_create(db, payload)

