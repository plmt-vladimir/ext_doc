from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from modules.core.models.organization import (
    Organization, OrgEmployee, OrgRole, OrgRoleAssignment
)
from modules.core.schemas.organization import (
    OrganizationOut, OrganizationCreate, OrganizationShortOut,
    OrgEmployeeOut, OrgEmployeeCreate,
    OrgRoleOut, OrgRoleCreate,
    OrgRoleAssignmentOut, OrgRoleAssignmentCreate
)
from common.database import get_async_session

router = APIRouter(prefix="/organizations", tags=["Organizations"])

#  ОРГАНИЗАЦИИ

@router.get("/", response_model=list[OrganizationShortOut])
async def get_organizations(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Organization))
    return result.scalars().all()

@router.post("/", response_model=OrganizationOut)
async def create_organization(
    org: OrganizationCreate,
    session: AsyncSession = Depends(get_async_session)
):
    db_org = Organization(**org.dict())
    session.add(db_org)
    await session.commit()
    await session.refresh(db_org)
    result = await session.execute(
        select(Organization)
        .options(joinedload(Organization.employees))
        .where(Organization.id == db_org.id)
    )
    org_with_emps = result.unique().scalars().first()
    return org_with_emps

@router.get("/{org_id}", response_model=OrganizationOut)
async def get_organization(
    org_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(Organization)
        .options(joinedload(Organization.employees))
        .where(Organization.id == org_id)
    )
    org = result.unique().scalars().first()
    if not org:
        raise HTTPException(404, "Organization not found")
    return org

@router.patch("/{org_id}", response_model=OrganizationOut)
async def update_organization(
    org_id: int,
    data: OrganizationCreate,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(Organization).where(Organization.id == org_id)
    )
    db_org = result.scalar_one_or_none()
    if not db_org:
        raise HTTPException(404, "Organization not found")
    for field, value in data.dict().items():
        setattr(db_org, field, value)
    await session.commit()
    await session.refresh(db_org)
    # Обязательно возвращаем с joinedload:
    result = await session.execute(
        select(Organization)
        .options(joinedload(Organization.employees))
        .where(Organization.id == org_id)
    )
    org_with_emps = result.unique().scalars().first()
    return org_with_emps

@router.delete("/{org_id}", status_code=204)
async def delete_organization(
    org_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Organization).where(Organization.id == org_id))
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(404, "Organization not found")
    await session.delete(org)
    await session.commit()
    return None
# СОТРУДНИКИ ОРГАНИЗАЦИИ 

@router.get("/{org_id}/employees", response_model=list[OrgEmployeeOut])
async def get_org_employees(
    org_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(OrgEmployee).where(OrgEmployee.organization_id == org_id)
    )
    return result.scalars().all()

@router.post("/{org_id}/employees", response_model=OrgEmployeeOut)
async def add_org_employee(
    org_id: int,
    data: OrgEmployeeCreate,
    session: AsyncSession = Depends(get_async_session)
):
    db_emp = OrgEmployee(**data.dict(), organization_id=org_id)
    session.add(db_emp)
    await session.commit()
    await session.refresh(db_emp)
    return db_emp

@router.patch("/{org_id}/employees/{emp_id}", response_model=OrgEmployeeOut)
async def update_org_employee(
    org_id: int,
    emp_id: int,
    data: OrgEmployeeCreate,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(OrgEmployee).where(OrgEmployee.id == emp_id, OrgEmployee.organization_id == org_id)
    )
    db_emp = result.scalar_one_or_none()
    if not db_emp:
        raise HTTPException(404, "Employee not found")
    for field, value in data.dict().items():
        setattr(db_emp, field, value)
    await session.commit()
    await session.refresh(db_emp)
    return db_emp
# Удаление сотрудника 
@router.delete("/{org_id}/employees/{emp_id}", status_code=204)
async def delete_org_employee(
    org_id: int,
    emp_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(OrgEmployee).where(OrgEmployee.id == emp_id, OrgEmployee.organization_id == org_id)
    )
    db_emp = result.scalar_one_or_none()
    if not db_emp:
        raise HTTPException(404, "Employee not found")
    await session.delete(db_emp)
    await session.commit()
    return None
#  РОЛИ ОРГАНИЗАЦИЙ

@router.get("/roles/", response_model=list[OrgRoleOut])
async def get_org_roles(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(OrgRole))
    return result.scalars().all()

@router.post("/roles/", response_model=OrgRoleOut)
async def create_org_role(
    role: OrgRoleCreate,
    session: AsyncSession = Depends(get_async_session)
):
    db_role = OrgRole(**role.dict())
    session.add(db_role)
    await session.commit()
    await session.refresh(db_role)
    return db_role

# ===== НАЗНАЧЕНИЯ РОЛЕЙ ОРГАНИЗАЦИИ =====

@router.get("/role-assignments/", response_model=list[OrgRoleAssignmentOut])
async def get_role_assignments(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(OrgRoleAssignment))
    return result.scalars().all()

@router.post("/role-assignments/", response_model=OrgRoleAssignmentOut)
async def create_role_assignment(
    data: OrgRoleAssignmentCreate,
    session: AsyncSession = Depends(get_async_session)
):
    # Защита от дублей (одна и та же организация, роль и объект/площадка)
    stmt = select(OrgRoleAssignment).where(
        OrgRoleAssignment.organization_id == data.organization_id,
        OrgRoleAssignment.role_id == data.role_id,
        OrgRoleAssignment.construction_site_id == data.construction_site_id,
        OrgRoleAssignment.construction_object_id == data.construction_object_id,
    )
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing:
        return existing
    db_assignment = OrgRoleAssignment(**data.dict())
    session.add(db_assignment)
    await session.commit()
    await session.refresh(db_assignment)
    return db_assignment


