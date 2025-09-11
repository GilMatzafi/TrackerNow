from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class OnboardingTaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: bool = False


class OnboardingTaskCreate(OnboardingTaskBase):
    pass


class OnboardingTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


class OnboardingTask(OnboardingTaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
