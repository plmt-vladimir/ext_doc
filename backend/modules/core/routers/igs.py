from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path
from uuid import uuid4
import os

from modules.core.models.igs_labtest import IGS
from common.database import get_async_session
from modules.core.schemas.igs import IgsSchema, IgsOut

router = APIRouter(prefix="/igs", tags=["IGS"])

# === Папка для загрузки PDF-файлов ===
UPLOAD_DIR = Path("data/igs")

# === Загрузка файла ИГС (PDF) ===
@router.post("/upload")
async def upload_igs_file(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1]
    unique_name = f"{uuid4()}.{ext}"
    file_path = UPLOAD_DIR / unique_name

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"file_url": f"/files/igs/{unique_name}"}


# === Создание новой ИГС ===
@router.post("/")
async def create_igs(data: IgsSchema, session: AsyncSession = Depends(get_async_session)):
    igs = IGS(**data.dict())
    session.add(igs)
    await session.commit()
    await session.refresh(igs)
    return {"id": igs.id}


# === Получение списка ИГС с фильтрацией по стройке/объекту/участку ===
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


# === Удаление ИГС и связанного файла ===
@router.delete("/{igs_id}")
async def delete_igs(igs_id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(IGS).where(IGS.id == igs_id))
    igs = result.scalar_one_or_none()

    if not igs:
        raise HTTPException(status_code=404, detail="ИГС не найдена")

    file_path = Path(UPLOAD_DIR / Path(igs.file_url).name)
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Не удалось удалить файл: {e}")

    await session.delete(igs)
    await session.commit()
    return {"detail": "Удалено"}


# === Обновление существующей ИГС (включая замену файла) ===
@router.put("/{igs_id}")
async def update_igs(igs_id: int, data: IgsSchema, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(IGS).where(IGS.id == igs_id))
    igs = result.scalar_one_or_none()

    if not igs:
        raise HTTPException(status_code=404, detail="ИГС не найдена")

    # Удаление старого файла, если имя изменилось
    if igs.file_url != data.file_url:
        old_path = Path(UPLOAD_DIR / Path(igs.file_url).name)
        if old_path.exists():
            try:
                old_path.unlink()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Не удалось удалить старый файл: {e}")

    # Обновление полей
    for field, value in data.dict().items():
        setattr(igs, field, value)

    await session.commit()
    await session.refresh(igs)
    return {"detail": "Обновлено"}



