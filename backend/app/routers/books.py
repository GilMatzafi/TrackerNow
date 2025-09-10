from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.resource import BookCreate, BookUpdate, BookResponse
from app.services import books as book_service

router = APIRouter()

@router.post("/", response_model=BookResponse)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new book entry"""
    return book_service.create_book(db=db, book=book, user_id=current_user.id)

@router.get("/", response_model=List[BookResponse])
def list_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List books with optional filtering"""
    return book_service.list_books(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        status=status,
        category=category,
        priority=priority,
        search=search
    )

@router.get("/{book_id}", response_model=BookResponse)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific book by ID"""
    book = book_service.get_book(db=db, book_id=book_id, user_id=current_user.id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_update: BookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a book entry"""
    book = book_service.update_book(
        db=db, 
        book_id=book_id, 
        book_update=book_update, 
        user_id=current_user.id
    )
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a book entry"""
    success = book_service.delete_book(db=db, book_id=book_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully"}

@router.get("/status/{status}", response_model=List[BookResponse])
def get_books_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get books by status"""
    return book_service.get_books_by_status(db=db, user_id=current_user.id, status=status)

@router.get("/category/{category}", response_model=List[BookResponse])
def get_books_by_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get books by category"""
    return book_service.get_books_by_category(db=db, user_id=current_user.id, category=category)

@router.get("/priority/{priority}", response_model=List[BookResponse])
def get_books_by_priority(
    priority: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get books by priority"""
    return book_service.get_books_by_priority(db=db, user_id=current_user.id, priority=priority)

@router.get("/stats/overview")
def get_books_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get books statistics for the current user"""
    return book_service.get_books_statistics(db=db, user_id=current_user.id)
