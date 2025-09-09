from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from typing import Optional
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, verify_token
from app.core.config import settings

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=hashed_password
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def create_tokens(self, user: User) -> dict:
        """Create access and refresh tokens for a user."""
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        # Create refresh token
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Store refresh token in database
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        db_refresh_token = RefreshToken(
            token=refresh_token,
            user_id=user.id,
            expires_at=expires_at
        )
        
        self.db.add(db_refresh_token)
        self.db.commit()
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    def refresh_access_token(self, refresh_token: str) -> Optional[dict]:
        """Refresh access token using refresh token."""
        # Verify refresh token
        payload = verify_token(refresh_token, "refresh")
        if not payload:
            return None
        
        user_id = int(payload.get("sub"))
        
        # Check if refresh token exists in database and is not revoked
        db_token = self.db.query(RefreshToken).filter(
            and_(
                RefreshToken.token == refresh_token,
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False,
                RefreshToken.expires_at > datetime.utcnow()
            )
        ).first()
        
        if not db_token:
            return None
        
        # Get user
        user = self.get_user_by_id(user_id)
        if not user or not user.is_active:
            return None
        
        # Create new access token
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    def revoke_refresh_token(self, refresh_token: str) -> bool:
        """Revoke a refresh token."""
        db_token = self.db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
        if db_token:
            db_token.is_revoked = True
            self.db.commit()
            return True
        return False

    def revoke_all_user_tokens(self, user_id: int) -> bool:
        """Revoke all refresh tokens for a user."""
        tokens = self.db.query(RefreshToken).filter(
            and_(
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False
            )
        ).all()
        
        for token in tokens:
            token.is_revoked = True
        
        self.db.commit()
        return True
