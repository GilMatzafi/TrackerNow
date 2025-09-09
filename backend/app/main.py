from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.routers.problems import router as problems_router
from app.routers.auth import router as auth_router

# Import models to ensure they are registered
from app.models import User, RefreshToken, Problem

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackerNow API", description="Coding Interview Tracker API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(problems_router)
