from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from app.models.resource import Book
from app.schemas.resource import BookCreate, BookUpdate
import json

def create_book(db: Session, book: BookCreate, user_id: int) -> Book:
    """Create a new book entry"""
    # Convert tags list to JSON string if provided
    tags_json = json.dumps(book.tags) if book.tags else None
    
    db_book = Book(
        user_id=user_id,
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        publisher=book.publisher,
        publication_year=book.publication_year,
        pages=book.pages,
        resource_type=book.resource_type,
        category=book.category,
        status=book.status,
        priority=book.priority,
        current_page=book.current_page,
        total_pages=book.total_pages,
        progress_percentage=book.progress_percentage,
        start_date=book.start_date,
        completion_date=book.completion_date,
        description=book.description,
        notes=book.notes,
        rating=book.rating,
        tags=tags_json,
        purchase_url=book.purchase_url,
        cover_image_url=book.cover_image_url,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book(db: Session, book_id: int, user_id: int) -> Optional[Book]:
    """Get a specific book by ID for a user"""
    return db.query(Book).filter(
        and_(Book.id == book_id, Book.user_id == user_id)
    ).first()

def list_books(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
) -> List[Book]:
    """List books for a user with optional filtering"""
    query = db.query(Book).filter(Book.user_id == user_id)
    
    # Apply filters
    if status:
        query = query.filter(Book.status == status)
    if category:
        query = query.filter(Book.category == category)
    if priority:
        query = query.filter(Book.priority == priority)
    if search:
        search_filter = or_(
            Book.title.ilike(f"%{search}%"),
            Book.author.ilike(f"%{search}%"),
            Book.description.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    return query.offset(skip).limit(limit).all()

def update_book(db: Session, book_id: int, book_update: BookUpdate, user_id: int) -> Optional[Book]:
    """Update a book entry"""
    db_book = get_book(db, book_id, user_id)
    if not db_book:
        return None
    
    # Convert tags list to JSON string if provided
    if book_update.tags is not None:
        tags_json = json.dumps(book_update.tags)
    else:
        tags_json = db_book.tags
    
    # Update only provided fields
    update_data = book_update.dict(exclude_unset=True)
    if 'tags' in update_data:
        update_data['tags'] = tags_json
    
    for field, value in update_data.items():
        setattr(db_book, field, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int, user_id: int) -> bool:
    """Delete a book entry"""
    db_book = get_book(db, book_id, user_id)
    if not db_book:
        return False
    
    db.delete(db_book)
    db.commit()
    return True

def get_books_by_status(db: Session, user_id: int, status: str) -> List[Book]:
    """Get books by status"""
    return db.query(Book).filter(
        and_(Book.user_id == user_id, Book.status == status)
    ).all()

def get_books_by_category(db: Session, user_id: int, category: str) -> List[Book]:
    """Get books by category"""
    return db.query(Book).filter(
        and_(Book.user_id == user_id, Book.category == category)
    ).all()

def get_books_by_priority(db: Session, user_id: int, priority: str) -> List[Book]:
    """Get books by priority"""
    return db.query(Book).filter(
        and_(Book.user_id == user_id, Book.priority == priority)
    ).all()

def get_books_statistics(db: Session, user_id: int) -> dict:
    """Get books statistics for a user"""
    total_books = db.query(Book).filter(Book.user_id == user_id).count()
    
    # Count by status
    status_counts = {}
    for status in ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED", "ABANDONED"]:
        count = db.query(Book).filter(
            and_(Book.user_id == user_id, Book.status == status)
        ).count()
        status_counts[status] = count
    
    # Count by category
    category_counts = {}
    for category in ["PROGRAMMING", "ALGORITHMS", "DATA_STRUCTURES", "SYSTEM_DESIGN", 
                     "DATABASE", "WEB_DEVELOPMENT", "MOBILE_DEVELOPMENT", "DEVOPS", 
                     "MACHINE_LEARNING", "CYBERSECURITY", "SOFT_SKILLS", "CAREER_DEVELOPMENT", 
                     "INTERVIEW_PREP", "OTHER"]:
        count = db.query(Book).filter(
            and_(Book.user_id == user_id, Book.category == category)
        ).count()
        if count > 0:
            category_counts[category] = count
    
    # Average rating
    avg_rating = db.query(Book).filter(
        and_(Book.user_id == user_id, Book.rating.isnot(None))
    ).with_entities(Book.rating).all()
    
    avg_rating_value = 0
    if avg_rating:
        ratings = [r[0] for r in avg_rating if r[0] is not None]
        if ratings:
            avg_rating_value = sum(ratings) / len(ratings)
    
    return {
        "total_books": total_books,
        "status_counts": status_counts,
        "category_counts": category_counts,
        "average_rating": round(avg_rating_value, 2)
    }
