from pydantic import BaseModel
from datetime import date
from typing import List, Optional



class DeliveryOut(BaseModel):
    id: int
    supplier: str
    supply_type: str
    record_number: str
    invoice_number: str
    record_date: date
    invoice_date: date
    invoice_file_url: str
    note: str

    site_id: int
    object_id: Optional[int]
    zone_id: Optional[int]

    class Config:
        orm_mode = True

class MaterialReferenceOut(BaseModel):
    id: int
    name: str
    type: str
    unit: str

    class Config:
        orm_mode = True
        
class QualityDocumentOut(BaseModel):
    id: int
    type: str
    number: str
    issue_date: date
    expiry_date: date
    file_url: str
    materials: Optional[List[str]] = []

    class Config:
        orm_mode = True
class MaterialReferenceIn(BaseModel):
    name: str
    type: str
    unit: str

class DeliveredMaterialIn(BaseModel):
    material_id: int
    quantity: float
    quality_doc_ids: List[int]   

class DeliveredMaterialOut(BaseModel):
    id: int
    quantity: float
    material: MaterialReferenceOut
    delivery: DeliveryOut
    quality_documents: List[QualityDocumentOut]   

    class Config:
        orm_mode = True

class DeliveryCreate(BaseModel):
    supplier: str
    supply_type: str
    record_number: str
    invoice_number: str
    record_date: date
    invoice_date: date
    invoice_file_url: str
    note: str
    site_id: int
    object_id: Optional[int]
    zone_id: Optional[int]
    materials: List[DeliveredMaterialIn]
    
class QualityDocumentCreate(BaseModel):
    type: str
    number: str
    issue_date: date
    expiry_date: date
    file_url: Optional[str]
 




