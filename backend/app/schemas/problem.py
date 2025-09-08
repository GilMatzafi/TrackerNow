from pydantic import BaseModel

class ProblemBase(BaseModel):
    title: str
    difficulty: str

class ProblemCreate(ProblemBase):
    pass

class ProblemRead(ProblemBase):
    id: int
    class Config:
        from_attributes = True
