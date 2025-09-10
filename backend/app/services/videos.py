from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from app.models.resource import Video
from app.schemas.resource import VideoCreate, VideoUpdate
import json

def create_video(db: Session, video: VideoCreate, user_id: int) -> Video:
    """Create a new video entry"""
    # Convert tags list to JSON string if provided
    tags_json = json.dumps(video.tags) if video.tags else None
    
    db_video = Video(
        user_id=user_id,
        title=video.title,
        creator=video.creator,
        channel=video.channel,
        platform=video.platform,
        resource_type=video.resource_type,
        category=video.category,
        status=video.status,
        priority=video.priority,
        duration_minutes=video.duration_minutes,
        video_url=video.video_url,
        thumbnail_url=video.thumbnail_url,
        video_id=video.video_id,
        current_time_minutes=video.current_time_minutes,
        progress_percentage=video.progress_percentage,
        start_date=video.start_date,
        completion_date=video.completion_date,
        watch_count=video.watch_count,
        description=video.description,
        notes=video.notes,
        rating=video.rating,
        tags=tags_json,
        playlist=video.playlist,
        difficulty_level=video.difficulty_level,
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def get_video(db: Session, video_id: int, user_id: int) -> Optional[Video]:
    """Get a specific video by ID for a user"""
    return db.query(Video).filter(
        and_(Video.id == video_id, Video.user_id == user_id)
    ).first()

def list_videos(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    platform: Optional[str] = None,
    search: Optional[str] = None
) -> List[Video]:
    """List videos for a user with optional filtering"""
    query = db.query(Video).filter(Video.user_id == user_id)
    
    # Apply filters
    if status:
        query = query.filter(Video.status == status)
    if category:
        query = query.filter(Video.category == category)
    if priority:
        query = query.filter(Video.priority == priority)
    if platform:
        query = query.filter(Video.platform == platform)
    if search:
        search_filter = or_(
            Video.title.ilike(f"%{search}%"),
            Video.creator.ilike(f"%{search}%"),
            Video.channel.ilike(f"%{search}%"),
            Video.description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    return query.offset(skip).limit(limit).all()

def update_video(db: Session, video_id: int, video_update: VideoUpdate, user_id: int) -> Optional[Video]:
    """Update a video entry"""
    db_video = get_video(db, video_id, user_id)
    if not db_video:
        return None
    
    # Convert tags list to JSON string if provided
    if video_update.tags is not None:
        tags_json = json.dumps(video_update.tags)
    else:
        tags_json = db_video.tags
    
    # Update only provided fields
    update_data = video_update.dict(exclude_unset=True)
    if 'tags' in update_data:
        update_data['tags'] = tags_json
    
    for field, value in update_data.items():
        setattr(db_video, field, value)
    
    db.commit()
    db.refresh(db_video)
    return db_video

def delete_video(db: Session, video_id: int, user_id: int) -> bool:
    """Delete a video entry"""
    db_video = get_video(db, video_id, user_id)
    if not db_video:
        return False
    
    db.delete(db_video)
    db.commit()
    return True

def get_videos_by_status(db: Session, user_id: int, status: str) -> List[Video]:
    """Get videos by status"""
    return db.query(Video).filter(
        and_(Video.user_id == user_id, Video.status == status)
    ).all()

def get_videos_by_category(db: Session, user_id: int, category: str) -> List[Video]:
    """Get videos by category"""
    return db.query(Video).filter(
        and_(Video.user_id == user_id, Video.category == category)
    ).all()

def get_videos_by_platform(db: Session, user_id: int, platform: str) -> List[Video]:
    """Get videos by platform"""
    return db.query(Video).filter(
        and_(Video.user_id == user_id, Video.platform == platform)
    ).all()

def get_videos_by_priority(db: Session, user_id: int, priority: str) -> List[Video]:
    """Get videos by priority"""
    return db.query(Video).filter(
        and_(Video.user_id == user_id, Video.priority == priority)
    ).all()

def increment_watch_count(db: Session, video_id: int, user_id: int) -> Optional[Video]:
    """Increment the watch count for a video"""
    db_video = get_video(db, video_id, user_id)
    if not db_video:
        return None
    
    db_video.watch_count += 1
    db.commit()
    db.refresh(db_video)
    return db_video

def get_videos_statistics(db: Session, user_id: int) -> dict:
    """Get videos statistics for a user"""
    total_videos = db.query(Video).filter(Video.user_id == user_id).count()
    
    # Count by status
    status_counts = {}
    for status in ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED", "ABANDONED"]:
        count = db.query(Video).filter(
            and_(Video.user_id == user_id, Video.status == status)
        ).count()
        status_counts[status] = count
    
    # Count by category
    category_counts = {}
    for category in ["PROGRAMMING", "ALGORITHMS", "DATA_STRUCTURES", "SYSTEM_DESIGN", 
                     "DATABASE", "WEB_DEVELOPMENT", "MOBILE_DEVELOPMENT", "DEVOPS", 
                     "MACHINE_LEARNING", "CYBERSECURITY", "SOFT_SKILLS", "CAREER_DEVELOPMENT", 
                     "INTERVIEW_PREP", "OTHER"]:
        count = db.query(Video).filter(
            and_(Video.user_id == user_id, Video.category == category)
        ).count()
        if count > 0:
            category_counts[category] = count
    
    # Count by platform
    platform_counts = {}
    platforms = db.query(Video.platform).filter(
        and_(Video.user_id == user_id, Video.platform.isnot(None))
    ).distinct().all()
    
    for platform in platforms:
        if platform[0]:
            count = db.query(Video).filter(
                and_(Video.user_id == user_id, Video.platform == platform[0])
            ).count()
            platform_counts[platform[0]] = count
    
    # Average rating
    avg_rating = db.query(Video).filter(
        and_(Video.user_id == user_id, Video.rating.isnot(None))
    ).with_entities(Video.rating).all()
    
    avg_rating_value = 0
    if avg_rating:
        ratings = [r[0] for r in avg_rating if r[0] is not None]
        if ratings:
            avg_rating_value = sum(ratings) / len(ratings)
    
    # Total watch time
    total_watch_time = db.query(Video).filter(
        and_(Video.user_id == user_id, Video.duration_minutes.isnot(None))
    ).with_entities(Video.duration_minutes).all()
    
    total_minutes = 0
    if total_watch_time:
        durations = [d[0] for d in total_watch_time if d[0] is not None]
        total_minutes = sum(durations)
    
    return {
        "total_videos": total_videos,
        "status_counts": status_counts,
        "category_counts": category_counts,
        "platform_counts": platform_counts,
        "average_rating": round(avg_rating_value, 2),
        "total_watch_time_minutes": total_minutes
    }
