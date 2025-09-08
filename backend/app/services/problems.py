from sqlalchemy.orm import Session
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate

def list_problems(db: Session) -> list[Problem]:
    return db.query(Problem).all()

def create_problem(db: Session, payload: ProblemCreate) -> Problem:
    obj = Problem(title=payload.title, difficulty=payload.difficulty)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
