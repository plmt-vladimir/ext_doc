# schemas/aosr.py
from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# Базовая схема (то, что приходит в create/update)
class AOSRBase(BaseModel):
    act_number: str
    full_name: str
    start_date: date
    end_date: date
    sign_date: date
    status: str
    registry_code: str
    type_code: str
    aook_code: str
    axes: str
    marks: str
    work_type_label: str
    zone_id: int
    object_id: int
    file_url: str 

class AOSRCreate(AOSRBase):
    pass

class AOSRUpdate(AOSRBase):
    pass

class AOSROut(AOSRBase):
    id: int

    class Config:
        orm_mode = True
