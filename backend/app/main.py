from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine
from app.db.base import Base
from app.routers.problems import router as problems_router
from app.routers.auth import router as auth_router
from app.routers.pomodoros import router as pomodoros_router
from app.routers.pomodoro_sessions import router as pomodoro_sessions_router
from app.routers.onboarding_tasks import router as onboarding_tasks_router
from app.routers.calendar_events import router as calendar_events_router
from app.routers.timer_settings import router as timer_settings_router
from app.routers.jobs import router as jobs_router

# Import models to ensure they are registered
from app.models import User, RefreshToken, Problem, Pomodoro, PomodoroSession, OnboardingTask, CalendarEvent, TimerSettings, Job, Contact

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
app.include_router(pomodoros_router)
app.include_router(pomodoro_sessions_router, prefix="/pomodoro-sessions", tags=["pomodoro-sessions"])
app.include_router(onboarding_tasks_router, prefix="/onboarding-tasks", tags=["onboarding-tasks"])
app.include_router(calendar_events_router, prefix="/calendar-events", tags=["calendar-events"])
app.include_router(timer_settings_router, prefix="/timer-settings", tags=["timer-settings"])
app.include_router(jobs_router, prefix="/jobs", tags=["jobs"])
