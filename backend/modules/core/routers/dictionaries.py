from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from modules.core.models.dictionaries import QualityDocType, ActStatus, WorkRegistry
from modules.core.schemas.dictionaries import QualityDocTypeOut, ActStatusOut, QualityDocTypeIn, ActStatusIn, WorkRegistryIn, WorkRegistryOut
from common.database import get_async_session

router = APIRouter(prefix="/dictionaries", tags=["Dictionaries"])

@router.get("/quality-doc-types", response_model=list[QualityDocTypeOut])
async def get_quality_doc_types(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(QualityDocType))
    return result.scalars().all()

@router.get("/act-statuses", response_model=list[ActStatusOut])
async def get_act_statuses(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(ActStatus))
    return result.scalars().all()

@router.post("/quality-doc-types", response_model=QualityDocTypeOut)
async def add_quality_doc_type(
    data: QualityDocTypeIn,
    db: AsyncSession = Depends(get_async_session)
):
    obj = QualityDocType(code=data.code, label=data.label)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.post("/act-statuses", response_model=ActStatusOut)
async def add_act_status(
    data: ActStatusIn,
    db: AsyncSession = Depends(get_async_session)
):
    obj = ActStatus(code=data.code, label=data.label, order=data.order)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

# Реестр работ 
@router.get("/work-registry", response_model=list[WorkRegistryOut])
async def get_work_registry(
    object_id: int = Query(...),
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(select(WorkRegistry).where(WorkRegistry.object_id == object_id))
    return result.scalars().all()

@router.post("/work-registry", response_model=WorkRegistryOut)
async def add_work_registry(
    data: WorkRegistryIn,
    db: AsyncSession = Depends(get_async_session)
):
    obj = WorkRegistry(**data.dict())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.put("/work-registry/{id}", response_model=WorkRegistryOut)
async def update_work_registry(
    id: int,
    data: WorkRegistryIn,
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(select(WorkRegistry).where(WorkRegistry.id == id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, detail="Запись не найдена")
    for key, value in data.dict().items():
        setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/work-registry/{id}")
async def delete_work_registry(
    id: int,
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(select(WorkRegistry).where(WorkRegistry.id == id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, detail="Запись не найдена")
    await db.delete(obj)
    await db.commit()
    return {"result": "ok"}