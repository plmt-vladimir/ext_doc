from pydantic import BaseModel
from datetime import date

class LabTestSchema(BaseModel):
    title: str
    axes: str
    marks: str
    date: date
    file_url: str
    site_id: int
    object_id: int | None = None
    zone_id: int | None = None

    class Config:
        orm_mode = True
        extra = "forbid"

class LabTestOut(LabTestSchema):
    id: int
