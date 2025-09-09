from pydantic import BaseModel
from typing import Optional

class ProblemBase(BaseModel):
    title: str
    difficulty: str

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: int
    
    class Config:
        from_attributes = True
