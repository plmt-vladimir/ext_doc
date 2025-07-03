from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# --- Сотрудник организации ---
class OrgEmployeeBase(BaseModel):
    full_name: str
    position: Optional[str] = None
    ins: Optional[str] = None
    decree_number: Optional[str] = None
    decree_date: Optional[date] = None

class OrgEmployeeCreate(OrgEmployeeBase):
    pass

class OrgEmployeeOut(OrgEmployeeBase):
    id: int

    class Config:
        orm_mode = True

# --- Организация ---
class OrganizationBase(BaseModel):
    name: str
    ogrn: str
    inn: str
    address: str
    phone: str
    license_name: str
    license_number: str
    license_date: date
    sro_name: str
    sro_number: str
    sro_ogrn: str
    sro_inn: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationShortOut(OrganizationBase):
    id: int
    class Config:
        orm_mode = True

class OrganizationOut(OrganizationBase):
    id: int
    employees: List[OrgEmployeeOut] = []

    class Config:
        orm_mode = True

# --- Роль организации ---
class OrgRoleBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None

class OrgRoleCreate(OrgRoleBase):
    pass

class OrgRoleOut(OrgRoleBase):
    id: int

    class Config:
        orm_mode = True

# --- Назначение роли ---
class OrgRoleAssignmentBase(BaseModel):
    organization_id: int
    construction_site_id: Optional[int] = None
    construction_object_id: Optional[int] = None
    role_id: int

class OrgRoleAssignmentCreate(OrgRoleAssignmentBase):
    pass

class OrgRoleAssignmentOut(OrgRoleAssignmentBase):
    id: int

    class Config:
        orm_mode = True


