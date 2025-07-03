from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from common.database import get_async_session
from modules.core.models.construction import ConstructionSite as Site, ConstructionObject, ConstructionZone
from modules.core.schemas.construction import SiteOut, ObjectOut, ZoneOut, SiteCreate, ObjectCreate, ZoneCreate 


router = APIRouter(prefix="/construction", tags=["Construction"])

@router.post("/sites", response_model=SiteOut)
async def create_site(
    site: SiteCreate,
    db: AsyncSession = Depends(get_async_session)
):
    new_site = Site(**site.dict())
    db.add(new_site)
    await db.commit()
    await db.refresh(new_site)
    return new_site

@router.get("/sites", response_model=list[SiteOut])
async def get_sites(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Site))
    return result.scalars().all()

@router.get("/objects/{site_id}", response_model=list[ObjectOut])
async def get_objects(site_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(ConstructionObject).where(ConstructionObject.site_id == site_id))
    return result.scalars().all()

@router.get("/zones/{object_id}", response_model=list[ZoneOut])
async def get_zones(object_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(ConstructionZone).where(ConstructionZone.object_id == object_id))
    return result.scalars().all()

@router.post("/objects", response_model=ObjectOut)
async def create_object(
    data: ObjectCreate,   
    db: AsyncSession = Depends(get_async_session)
):
    new_obj = ConstructionObject(**data.dict())
    db.add(new_obj)
    await db.commit()
    await db.refresh(new_obj)
    return new_obj

@router.post("/zones", response_model=ZoneOut)
async def create_zone(
    data: ZoneCreate,
    db: AsyncSession = Depends(get_async_session)
):
    new_zone = ConstructionZone(**data.dict())
    db.add(new_zone)
    await db.commit()
    await db.refresh(new_zone)
    return new_zone
