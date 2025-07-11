from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path
from uuid import uuid4
import os

from modules.core.models.igs_labtest import IGS
from common.database import get_async_session
from modules.core.schemas.igs import IgsSchema, IgsOut
from common.minio_client import upload_file_to_minio, delete_file_from_minio
from fastapi.responses import RedirectResponse
from common.minio_client import get_presigned_url

router = APIRouter(prefix="/igs", tags=["IGS"])

# Открытие по пресайнду файла
@router.get("/files/{object_path:path}")
async def get_file(object_path: str):
    url = get_presigned_url(object_path)
    return RedirectResponse(url)
# Загрузка файла ИГС (PDF) 
@router.post("/upload")
async def upload_igs_file(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower().lstrip(".")
    if ext != "pdf":
        raise HTTPException(status_code=400, detail="Только PDF разрешены")

    file_bytes = await file.read()
    filename = file.filename or "igs.pdf"
    object_name = upload_file_to_minio(file_bytes, filename, folder="igs")

    return {"file_url": object_name}


# Создание новой ИГС
@router.post("/")
async def create_igs(data: IgsSchema, session: AsyncSession = Depends(get_async_session)):
    igs = IGS(**data.dict())
    session.add(igs)
    await session.commit()
    await session.refresh(igs)
    return {"id": igs.id}


#Получение списка ИГС с фильтрацией по стройке/объекту/участку 
@router.get("/", response_model=list[IgsOut])
async def get_igs(
    site_id: int = Query(..., description="ID строительной площадки (обязательно)"),
    object_id: int | None = Query(None, description="ID объекта (опционально)"),
    zone_id: int | None = Query(None, description="ID участка (опционально)"),
    session: AsyncSession = Depends(get_async_session)
):
    stmt = select(IGS).where(IGS.site_id == site_id)

    if object_id is not None:
        stmt = stmt.where(IGS.object_id == object_id)
    if zone_id is not None:
        stmt = stmt.where(IGS.zone_id == zone_id)

    result = await session.execute(stmt)
    return result.scalars().all()


#Удаление ИГС и связанного файла
@router.delete("/{igs_id}")
async def delete_igs(igs_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(IGS).where(IGS.id == igs_id))
    igs = result.scalar_one_or_none()

    if not igs:
        raise HTTPException(status_code=404, detail="ИГС не найдена")

    if igs.file_url:
        delete_file_from_minio(igs.file_url)

    await session.delete(igs)
    await session.commit()
    return {"detail": "Удалено"}


#Обновление ИГС 
@router.put("/{igs_id}")
async def update_igs(igs_id: int, data: IgsSchema, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(IGS).where(IGS.id == igs_id))
    igs = result.scalar_one_or_none()

    if not igs:
        raise HTTPException(status_code=404, detail="ИГС не найдена")

    if igs.file_url != data.file_url:
        delete_file_from_minio(igs.file_url)

    for field, value in data.dict().items():
        setattr(igs, field, value)

    await session.commit()
    await session.refresh(igs)
    return {"detail": "Обновлено"}



