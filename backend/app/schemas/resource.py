from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List
from enum import Enum
from datetime import datetime

class ResourceType(str, Enum):
    BOOK = "BOOK"
    VIDEO = "VIDEO"
    ARTICLE = "ARTICLE"
    COURSE = "COURSE"
    PODCAST = "PODCAST"
    TUTORIAL = "TUTORIAL"
    DOCUMENTATION = "DOCUMENTATION"
    OTHER = "OTHER"

class ResourceStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    PAUSED = "PAUSED"
    ABANDONED = "ABANDONED"

class ResourcePriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class ResourceCategory(str, Enum):
    PROGRAMMING = "PROGRAMMING"
    ALGORITHMS = "ALGORITHMS"
    DATA_STRUCTURES = "DATA_STRUCTURES"
    SYSTEM_DESIGN = "SYSTEM_DESIGN"
    DATABASE = "DATABASE"
    WEB_DEVELOPMENT = "WEB_DEVELOPMENT"
    MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT"
    DEVOPS = "DEVOPS"
    MACHINE_LEARNING = "MACHINE_LEARNING"
    CYBERSECURITY = "CYBERSECURITY"
    SOFT_SKILLS = "SOFT_SKILLS"
    CAREER_DEVELOPMENT = "CAREER_DEVELOPMENT"
    INTERVIEW_PREP = "INTERVIEW_PREP"
    OTHER = "OTHER"

# Book Schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    pages: Optional[int] = None
    resource_type: ResourceType = ResourceType.BOOK
    category: Optional[ResourceCategory] = None
    status: ResourceStatus = ResourceStatus.NOT_STARTED
    priority: ResourcePriority = ResourcePriority.MEDIUM
    current_page: Optional[int] = None
    total_pages: Optional[int] = None
    progress_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    purchase_url: Optional[str] = None
    cover_image_url: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

    @validator('progress_percentage')
    def validate_progress(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Progress percentage must be between 0 and 100')
        return v

    @validator('publication_year')
    def validate_publication_year(cls, v):
        if v is not None and (v < 1000 or v > datetime.now().year + 1):
            raise ValueError('Publication year must be reasonable')
        return v

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    pages: Optional[int] = None
    category: Optional[ResourceCategory] = None
    status: Optional[ResourceStatus] = None
    priority: Optional[ResourcePriority] = None
    current_page: Optional[int] = None
    total_pages: Optional[int] = None
    progress_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    purchase_url: Optional[str] = None
    cover_image_url: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

    @validator('progress_percentage')
    def validate_progress(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Progress percentage must be between 0 and 100')
        return v

    @validator('publication_year')
    def validate_publication_year(cls, v):
        if v is not None and (v < 1000 or v > datetime.now().year + 1):
            raise ValueError('Publication year must be reasonable')
        return v

class BookResponse(BookBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    @validator('tags', pre=True)
    def parse_tags(cls, v):
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return []
        return v or []

    class Config:
        from_attributes = True

# Video Schemas
class VideoBase(BaseModel):
    title: str
    creator: str
    channel: Optional[str] = None
    platform: Optional[str] = None
    resource_type: ResourceType = ResourceType.VIDEO
    category: Optional[ResourceCategory] = None
    status: ResourceStatus = ResourceStatus.NOT_STARTED
    priority: ResourcePriority = ResourcePriority.MEDIUM
    duration_minutes: Optional[int] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    video_id: Optional[str] = None
    current_time_minutes: Optional[int] = None
    progress_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    watch_count: int = 0
    description: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    playlist: Optional[str] = None
    difficulty_level: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

    @validator('progress_percentage')
    def validate_progress(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Progress percentage must be between 0 and 100')
        return v

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v is not None and v < 0:
            raise ValueError('Duration must be positive')
        return v

    @validator('current_time_minutes')
    def validate_current_time(cls, v):
        if v is not None and v < 0:
            raise ValueError('Current time must be positive')
        return v

class VideoCreate(VideoBase):
    pass

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    creator: Optional[str] = None
    channel: Optional[str] = None
    platform: Optional[str] = None
    category: Optional[ResourceCategory] = None
    status: Optional[ResourceStatus] = None
    priority: Optional[ResourcePriority] = None
    duration_minutes: Optional[int] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    video_id: Optional[str] = None
    current_time_minutes: Optional[int] = None
    progress_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    watch_count: Optional[int] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    playlist: Optional[str] = None
    difficulty_level: Optional[str] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

    @validator('progress_percentage')
    def validate_progress(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('Progress percentage must be between 0 and 100')
        return v

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v is not None and v < 0:
            raise ValueError('Duration must be positive')
        return v

    @validator('current_time_minutes')
    def validate_current_time(cls, v):
        if v is not None and v < 0:
            raise ValueError('Current time must be positive')
        return v

class VideoResponse(VideoBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    @validator('tags', pre=True)
    def parse_tags(cls, v):
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return []
        return v or []

    class Config:
        from_attributes = True
