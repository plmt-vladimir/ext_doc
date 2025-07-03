from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from modules.core.models.aosr import AOSR
from modules.core.schemas.aosr import AOSROut, AOSRCreate, AOSRUpdate
from common.database import get_async_session
from typing import List

router = APIRouter(prefix="/aosr", tags=["AOSR"])

@router.get("/", response_model=List[AOSROut])
async def list_aosr(
    site_id: int = Query(None),
    object_id: int = Query(None),
    zone_id: int = Query(None),
    session: AsyncSession = Depends(get_async_session)
):
    query = select(AOSR)
    if site_id:

        from modules.core.models.construction import ConstructionZone, ConstructionObject
        query = query.join(ConstructionZone, ConstructionZone.id == AOSR.zone_id)
        query = query.join(ConstructionObject, ConstructionObject.id == ConstructionZone.object_id)
        query = query.where(ConstructionObject.site_id == site_id)
    if object_id:
        query = query.where(AOSR.object_id == object_id)
    if zone_id:
        query = query.where(AOSR.zone_id == zone_id)
    result = await session.execute(query)
    return result.scalars().all()

@router.get("/{aosr_id}", response_model=AOSROut)
async def get_aosr(aosr_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(AOSR).where(AOSR.id == aosr_id))
    aosr = result.scalar_one_or_none()
    if not aosr:
        raise HTTPException(404, "AOSR not found")
    return aosr

@router.post("/", response_model=AOSROut)
async def create_aosr(data: AOSRCreate, session: AsyncSession = Depends(get_async_session)):
    db_aosr = AOSR(**data.dict())
    session.add(db_aosr)
    await session.commit()
    await session.refresh(db_aosr)
    return db_aosr

@router.put("/{aosr_id}", response_model=AOSROut)
async def update_aosr(aosr_id: int, data: AOSRUpdate, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(AOSR).where(AOSR.id == aosr_id))
    db_aosr = result.scalar_one_or_none()
    if not db_aosr:
        raise HTTPException(404, "AOSR not found")
    for k, v in data.dict().items():
        setattr(db_aosr, k, v)
    await session.commit()
    await session.refresh(db_aosr)
    return db_aosr

@router.delete("/{aosr_id}")
async def delete_aosr(aosr_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(AOSR).where(AOSR.id == aosr_id))
    db_aosr = result.scalar_one_or_none()
    if not db_aosr:
        raise HTTPException(404, "AOSR not found")
    await session.delete(db_aosr)
    await session.commit()
    return {"result": "ok"}
