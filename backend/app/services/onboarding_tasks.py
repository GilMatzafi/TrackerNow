from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.onboarding_task import OnboardingTask
from app.schemas.onboarding_task import OnboardingTaskCreate, OnboardingTaskUpdate
from app.models.user import User


class OnboardingTasksService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_tasks(self, user_id: int) -> List[OnboardingTask]:
        """Get all onboarding tasks for a user"""
        return self.db.query(OnboardingTask).filter(OnboardingTask.user_id == user_id).all()

    def get_task(self, task_id: int, user_id: int) -> Optional[OnboardingTask]:
        """Get a specific onboarding task by ID for a user"""
        return self.db.query(OnboardingTask).filter(
            OnboardingTask.id == task_id,
            OnboardingTask.user_id == user_id
        ).first()

    def create_task(self, user_id: int, task_data: OnboardingTaskCreate) -> OnboardingTask:
        """Create a new onboarding task for a user"""
        task = OnboardingTask(
            title=task_data.title,
            description=task_data.description,
            due_date=task_data.due_date,
            completed=task_data.completed,
            user_id=user_id
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: int, user_id: int, task_data: OnboardingTaskUpdate) -> Optional[OnboardingTask]:
        """Update an onboarding task"""
        task = self.get_task(task_id, user_id)
        if not task:
            return None

        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        self.db.commit()
        self.db.refresh(task)
        return task

    def delete_task(self, task_id: int, user_id: int) -> bool:
        """Delete an onboarding task"""
        task = self.get_task(task_id, user_id)
        if not task:
            return False

        self.db.delete(task)
        self.db.commit()
        return True

    def toggle_task_completion(self, task_id: int, user_id: int) -> Optional[OnboardingTask]:
        """Toggle the completion status of a task"""
        task = self.get_task(task_id, user_id)
        if not task:
            return None

        task.completed = not task.completed
        self.db.commit()
        self.db.refresh(task)
        return task
