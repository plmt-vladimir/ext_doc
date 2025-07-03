from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from modules.core.models.dictionaries import QualityDocType, ActStatus
from modules.core.schemas.dictionaries import QualityDocTypeOut, ActStatusOut, QualityDocTypeIn, ActStatusIn
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