from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import RedirectResponse
from common.minio_client import get_presigned_url
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pathlib import Path
from modules.core.models.sp import SP
from modules.core.schemas.sp import SPCreate, SPOut, SPUpdate
from common.database import get_async_session
from common.minio_client import upload_file_to_minio, delete_file_from_minio

router = APIRouter(prefix="/sp", tags=["SP"])

@router.get("/files/{object_path:path}")
async def get_file(object_path: str):
    url = get_presigned_url(object_path)
    return RedirectResponse(url)


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

    # Удалить файл, если есть
    if sp.pdf_url:
        delete_file_from_minio(sp.pdf_url)

    await session.delete(sp)
    await session.commit()
    return {"ok": True}


@router.post("/upload", response_model=dict)
async def upload_sp_pdf(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower().lstrip(".")
    if ext != "pdf":
        raise HTTPException(status_code=400, detail="Только PDF разрешены")

    file_bytes = await file.read()
    filename = file.filename or "default_filename"
    object_name = upload_file_to_minio(file_bytes, filename, folder="sp")

    return {"file_url": object_name}
