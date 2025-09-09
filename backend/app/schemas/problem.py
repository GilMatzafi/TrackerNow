from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List
from enum import Enum
from datetime import datetime

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class ProblemStatus(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    NEEDS_REVISIT = "Needs Revisit"

class ProblemBase(BaseModel):
    name: str
    topics: List[str]
    difficulty: DifficultyLevel
    status: ProblemStatus = ProblemStatus.NOT_STARTED
    link: Optional[HttpUrl] = None
    time_minutes: Optional[int] = None
    notes: Optional[str] = None

    @validator('topics')
    def topics_must_not_be_empty(cls, v):
        if not v:
            raise ValueError('At least one topic must be provided')
        return v

    @validator('time_minutes')
    def time_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Time must be a positive number')
        return v

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(BaseModel):
    name: Optional[str] = None
    topics: Optional[List[str]] = None
    difficulty: Optional[DifficultyLevel] = None
    status: Optional[ProblemStatus] = None
    link: Optional[HttpUrl] = None
    time_minutes: Optional[int] = None
    notes: Optional[str] = None

    @validator('topics')
    def topics_must_not_be_empty(cls, v):
        if v is not None and not v:
            raise ValueError('At least one topic must be provided')
        return v

    @validator('time_minutes')
    def time_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Time must be a positive number')
        return v

class ProblemResponse(ProblemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
