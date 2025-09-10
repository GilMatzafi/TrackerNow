from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.resource import VideoCreate, VideoUpdate, VideoResponse
from app.services import videos as video_service

router = APIRouter()

@router.post("/", response_model=VideoResponse)
def create_video(
    video: VideoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new video entry"""
    return video_service.create_video(db=db, video=video, user_id=current_user.id)

@router.get("/", response_model=List[VideoResponse])
def list_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List videos with optional filtering"""
    return video_service.list_videos(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        status=status,
        category=category,
        priority=priority,
        platform=platform,
        search=search
    )

@router.get("/{video_id}", response_model=VideoResponse)
def get_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific video by ID"""
    video = video_service.get_video(db=db, video_id=video_id, user_id=current_user.id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.put("/{video_id}", response_model=VideoResponse)
def update_video(
    video_id: int,
    video_update: VideoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a video entry"""
    video = video_service.update_video(
        db=db, 
        video_id=video_id, 
        video_update=video_update, 
        user_id=current_user.id
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.delete("/{video_id}")
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a video entry"""
    success = video_service.delete_video(db=db, video_id=video_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted successfully"}

@router.post("/{video_id}/watch")
def increment_watch_count(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Increment the watch count for a video"""
    video = video_service.increment_watch_count(db=db, video_id=video_id, user_id=current_user.id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Watch count incremented", "watch_count": video.watch_count}

@router.get("/status/{status}", response_model=List[VideoResponse])
def get_videos_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get videos by status"""
    return video_service.get_videos_by_status(db=db, user_id=current_user.id, status=status)

@router.get("/category/{category}", response_model=List[VideoResponse])
def get_videos_by_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get videos by category"""
    return video_service.get_videos_by_category(db=db, user_id=current_user.id, category=category)

@router.get("/platform/{platform}", response_model=List[VideoResponse])
def get_videos_by_platform(
    platform: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get videos by platform"""
    return video_service.get_videos_by_platform(db=db, user_id=current_user.id, platform=platform)

@router.get("/priority/{priority}", response_model=List[VideoResponse])
def get_videos_by_priority(
    priority: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get videos by priority"""
    return video_service.get_videos_by_priority(db=db, user_id=current_user.id, priority=priority)

@router.get("/stats/overview")
def get_videos_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get videos statistics for the current user"""
    return video_service.get_videos_statistics(db=db, user_id=current_user.id)
