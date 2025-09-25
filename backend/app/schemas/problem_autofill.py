from pydantic import BaseModel
from typing import List, Optional

class ProblemAutoFillRequest(BaseModel):
    problem_name: str

class ProblemAutoFillResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    
    class Config:
        from_attributes = True
