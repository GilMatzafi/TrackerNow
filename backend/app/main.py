from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from app.routers.problems import router as problems_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LeetCode Tracker API")

@app.get("/ping")
def ping():
    return {"status": "ok"}

app.include_router(problems_router)
