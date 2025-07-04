from pydantic import BaseModel

class SiteCreate(BaseModel):
    full_name: str
    short_name: str
    address: str

class SiteOut(BaseModel):
    id: int
    full_name: str
    short_name: str
    address: str

    class Config:
        orm_mode = True

class ObjectOut(BaseModel):
    id: int
    site_id: int
    full_name: str
    short_name: str | None

    class Config:
        orm_mode = True

class ZoneOut(BaseModel):
    id: int
    object_id: int
    name: str
    code: str

    class Config:
        orm_mode = True
class ObjectCreate(BaseModel):
    site_id: int
    full_name: str
    short_name: str
    address: str

class ZoneCreate(BaseModel):
    object_id: int
    name: str
    address: str
    code: str