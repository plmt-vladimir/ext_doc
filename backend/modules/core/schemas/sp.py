from pydantic import BaseModel
from typing import Optional

class SPBase(BaseModel):
    code: str
    name: str

class SPCreate(SPBase):
    pdf_url: str

class SPUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    pdf_url: Optional[str] = None

class SPOut(SPBase):
    id: int
    pdf_url: str

    class Config:
        orm_mode = True

