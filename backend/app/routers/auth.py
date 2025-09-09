from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, TokenRefresh, TokenResponse
from app.services.user import UserService

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    user_service = UserService(db)
    
    try:
        user = user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access and refresh tokens."""
    user_service = UserService(db)
    
    # Authenticate user
    user = user_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    tokens = user_service.create_tokens(user)
    return tokens

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """Refresh access token using refresh token."""
    user_service = UserService(db)
    
    result = user_service.refresh_access_token(token_data.refresh_token)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return result

@router.post("/logout")
def logout(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """Logout user by revoking refresh token."""
    user_service = UserService(db)
    
    success = user_service.revoke_refresh_token(token_data.refresh_token)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token"
        )
    
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information."""
    return current_user
