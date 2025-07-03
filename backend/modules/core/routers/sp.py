from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pathlib import Path
import shutil
from uuid import uuid4
from modules.core.models.sp import SP
from modules.core.schemas.sp import SPCreate, SPOut, SPUpdate
from common.database import get_async_session

router = APIRouter(prefix="/sp", tags=["SP"])
UPLOAD_DIR = Path("data/sp")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=list[SPOut])
async def list_sp(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(SP))
    return result.scalars().all()

@router.post("/", response_model=SPOut)
async def create_sp(data: SPCreate, session: AsyncSession = Depends(get_async_session)):
    sp = SP(**data.dict())
    session.add(sp)
    await session.commit()
    await session.refresh(sp)
    return sp

@router.patch("/{sp_id}", response_model=SPOut)
async def update_sp(sp_id: int, data: SPUpdate, session: AsyncSession = Depends(get_async_session)):
    sp = await session.get(SP, sp_id)
    if not sp:
        raise HTTPException(404, "SP not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(sp, field, value)
    await session.commit()
    await session.refresh(sp)
    return sp

@router.delete("/{sp_id}")
async def delete_sp(sp_id: int, session: AsyncSession = Depends(get_async_session)):
    sp = await session.get(SP, sp_id)
    if not sp:
        raise HTTPException(404, "SP not found")
    await session.delete(sp)
    await session.commit()
    return {"ok": True}

@router.post("/upload", response_model=dict)
async def upload_sp_pdf(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    if ext != "pdf":
        raise HTTPException(400, "Только PDF")
    unique_name = f"{uuid4()}.{ext}"
    file_path = UPLOAD_DIR / unique_name
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"file_url": f"/files/sp/{unique_name}"}
