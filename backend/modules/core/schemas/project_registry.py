from pydantic import BaseModel
from typing import Optional, List


class ProjectSectionBase(BaseModel):
    section_code: str
    section_name: str
    discipline: Optional[str] = None
    designer: Optional[str] = None
    sheet_info: Optional[str] = None


class ProjectSectionIn(ProjectSectionBase):
    project_id: int


class ProjectSectionOut(ProjectSectionBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True


class ProjectBase(BaseModel):
    name: str


class ProjectIn(ProjectBase):
    object_id: int


class ProjectOut(ProjectBase):
    id: int
    object_id: int
    sections: List[ProjectSectionOut] = []

    class Config:
        orm_mode = True
