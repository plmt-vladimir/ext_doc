from pydantic import BaseModel

class QualityDocTypeOut(BaseModel):
    id: int
    code: str
    label: str

    model_config = {"from_attributes": True} 

class ActStatusOut(BaseModel):
    id: int
    code: str
    label: str
    order: int

    model_config = {"from_attributes": True} 
        
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

    model_config = {"from_attributes": True} 