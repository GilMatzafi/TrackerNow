# TrackerNow Backend API

A FastAPI-based backend for the TrackerNow coding interview tracker application.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Virtual environment (recommended)

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   ./start_server.sh
   # OR manually:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API:**
   - API Base URL: http://localhost:8000
   - Interactive API Docs: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc

## 🔐 Authentication Endpoints

### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123"
}
```

### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Refresh Access Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Logout
```http
POST /auth/logout
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 🧪 Testing

Run the test script to verify all endpoints:

```bash
python test_api.py
```

## 📊 Database

The application uses SQLite by default with the following tables:

- **users**: User accounts with email, names, and hashed passwords
- **refresh_tokens**: JWT refresh tokens with expiration and revocation
- **problems**: Coding problems (existing table)

## 🔧 Configuration

Environment variables (create `.env` file):

```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Access tokens (30 min) + Refresh tokens (7 days)
- **Token Revocation**: Secure logout with token invalidation
- **Email Validation**: Proper email format validation
- **Protected Routes**: Bearer token authentication

## 📝 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── deps.py          # Dependencies (DB, auth)
│   ├── core/
│   │   ├── config.py        # Configuration
│   │   └── security.py      # JWT & password utilities
│   ├── db/
│   │   ├── base.py          # Database base
│   │   └── session.py       # Database session
│   ├── models/
│   │   ├── user.py          # User model
│   │   ├── refresh_token.py # Refresh token model
│   │   └── problem.py       # Problem model
│   ├── routers/
│   │   ├── auth.py          # Authentication routes
│   │   └── problems.py      # Problem routes
│   ├── schemas/
│   │   ├── user.py          # User Pydantic schemas
│   │   └── problem.py       # Problem Pydantic schemas
│   ├── services/
│   │   ├── user.py          # User business logic
│   │   └── problems.py      # Problem business logic
│   └── main.py              # FastAPI app
├── requirements.txt         # Dependencies
├── start_server.sh         # Startup script
├── test_api.py            # API test script
└── README.md              # This file
```

## 🔄 Next Steps

1. **Frontend Integration**: Connect the frontend forms to these API endpoints
2. **Database Migration**: Set up proper database migrations
3. **Production Setup**: Configure for production deployment
4. **Additional Features**: Add more user management features
