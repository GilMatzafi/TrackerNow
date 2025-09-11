from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.onboarding_task import OnboardingTask, OnboardingTaskCreate, OnboardingTaskUpdate
from app.services.onboarding_tasks import OnboardingTasksService

router = APIRouter()


@router.get("/", response_model=List[OnboardingTask])
def get_user_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all onboarding tasks for the current user"""
    service = OnboardingTasksService(db)
    return service.get_user_tasks(current_user.id)


@router.post("/", response_model=OnboardingTask)
def create_task(
    task_data: OnboardingTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new onboarding task"""
    service = OnboardingTasksService(db)
    return service.create_task(current_user.id, task_data)


@router.get("/{task_id}", response_model=OnboardingTask)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific onboarding task"""
    service = OnboardingTasksService(db)
    task = service.get_task(task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=OnboardingTask)
def update_task(
    task_id: int,
    task_data: OnboardingTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an onboarding task"""
    service = OnboardingTasksService(db)
    task = service.update_task(task_id, current_user.id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an onboarding task"""
    service = OnboardingTasksService(db)
    success = service.delete_task(task_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/toggle", response_model=OnboardingTask)
def toggle_task_completion(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle the completion status of a task"""
    service = OnboardingTasksService(db)
    task = service.toggle_task_completion(task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task
