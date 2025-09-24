from sqlalchemy.orm import Session
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemUpdate
from typing import Optional

def list_problems(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Problem]:
    return db.query(Problem).filter(Problem.user_id == user_id).offset(skip).limit(limit).all()

def get_problem(db: Session, problem_id: int, user_id: int) -> Optional[Problem]:
    return db.query(Problem).filter(Problem.id == problem_id, Problem.user_id == user_id).first()

def create_problem(db: Session, payload: ProblemCreate, user_id: int) -> Problem:
    obj = Problem(
        user_id=user_id,
        name=payload.name,
        topics=payload.topics,
        difficulty=payload.difficulty,
        status=payload.status,
        link=str(payload.link) if payload.link else None,
        time_minutes=payload.time_minutes,
        notes=payload.notes
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_problem(db: Session, problem_id: int, payload: ProblemUpdate, user_id: int) -> Optional[Problem]:
    problem = db.query(Problem).filter(Problem.id == problem_id, Problem.user_id == user_id).first()
    if not problem:
        return None
    
    update_data = payload.dict(exclude_unset=True)
    if 'link' in update_data and update_data['link']:
        update_data['link'] = str(update_data['link'])
    
    for field, value in update_data.items():
        setattr(problem, field, value)
    
    db.commit()
    db.refresh(problem)
    return problem

def delete_problem(db: Session, problem_id: int, user_id: int) -> bool:
    problem = db.query(Problem).filter(Problem.id == problem_id, Problem.user_id == user_id).first()
    if not problem:
        return False
    
    db.delete(problem)
    db.commit()
    return True
