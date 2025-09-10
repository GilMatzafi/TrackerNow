from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.routers.problems import router as problems_router
from app.routers.applications import router as applications_router
from app.routers.books import router as books_router
from app.routers.videos import router as videos_router
from app.routers.auth import router as auth_router

# Import models to ensure they are registered
from app.models import User, RefreshToken, Problem, Application, Book, Video

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrackerNow API", description="Coding Interview Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],        
)

@app.get("/ping")
def ping():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(problems_router)
app.include_router(applications_router)
app.include_router(books_router, prefix="/books", tags=["books"])
app.include_router(videos_router, prefix="/videos", tags=["videos"])
