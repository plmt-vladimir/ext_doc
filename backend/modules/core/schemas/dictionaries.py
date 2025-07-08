from pydantic import BaseModel

class QualityDocTypeOut(BaseModel):
    id: int
    code: str
    label: str

    class Config:
         orm_mode = True

class ActStatusOut(BaseModel):
    id: int
    code: str
    label: str
    order: int

    class Config:
         orm_mode = True
        
class QualityDocTypeIn(BaseModel):
    code: str
    label: str

class ActStatusIn(BaseModel):
    code: str
    label: str
    order: int = 0

class WorkRegistryIn(BaseModel):
    object_id: int
    code: str
    title: str

class WorkRegistryOut(WorkRegistryIn):
    id: int

    class Config:
         orm_mode = True