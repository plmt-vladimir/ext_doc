from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path
from uuid import uuid4

from modules.core.models.igs_labtest import LabTest
from modules.core.schemas.labtest import LabTestSchema, LabTestOut
from common.database import get_async_session

router = APIRouter(prefix="/labtests", tags=["LabTests"])

# === Папка для хранения файлов лабораторных испытаний ===
UPLOAD_DIR = Path("data/labtests")

# === Загрузка PDF-файла ===
@router.post("/upload")
async def upload_labtest_file(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1]
    unique_name = f"{uuid4()}.{ext}"
    file_path = UPLOAD_DIR / unique_name

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"file_url": f"/files/labtests/{unique_name}"}

# === Создание лабораторного испытания ===
@router.post("/")
async def create_labtest(
    data: LabTestSchema,
    session: AsyncSession = Depends(get_async_session)
):
    labtest = LabTest(**data.dict())
    session.add(labtest)
    await session.commit()
    await session.refresh(labtest)
    return {"id": labtest.id}

# === Получение списка лабораторных испытаний с фильтрацией ===
@router.get("/", response_model=list[LabTestOut])
async def get_labtests(
    site_id: int = Query(...),
    object_id: int | None = Query(None),
    zone_id: int | None = Query(None),
    session: AsyncSession = Depends(get_async_session)
):
    stmt = select(LabTest).where(LabTest.site_id == site_id)

    if object_id is not None:
        stmt = stmt.where(LabTest.object_id == object_id)
    if zone_id is not None:
        stmt = stmt.where(LabTest.zone_id == zone_id)

    result = await session.execute(stmt)
    return result.scalars().all()

# === Обновление лабораторного испытания (при необходимости удаляет старый файл) ===
@router.put("/{labtest_id}")
async def update_labtest(
    labtest_id: int,
    data: LabTestSchema,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(LabTest).where(LabTest.id == labtest_id))
    labtest = result.scalar_one_or_none()

    if not labtest:
        raise HTTPException(status_code=404, detail="Лабораторное испытание не найдено")

    if labtest.file_url != data.file_url:
        old_path = UPLOAD_DIR / Path(labtest.file_url).name
        if old_path.exists():
            try:
                old_path.unlink()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Не удалось удалить старый файл: {e}")

    for field, value in data.dict().items():
        setattr(labtest, field, value)

    await session.commit()
    await session.refresh(labtest)
    return {"detail": "Обновлено"}

# === Удаление лабораторного испытания и файла ===
@router.delete("/{labtest_id}")
async def delete_labtest(
    labtest_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(LabTest).where(LabTest.id == labtest_id))
    labtest = result.scalar_one_or_none()

    if not labtest:
        raise HTTPException(status_code=404, detail="Лабораторное испытание не найдено")

    file_path = UPLOAD_DIR / Path(labtest.file_url).name
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Не удалось удалить файл: {e}")

    await session.delete(labtest)
    await session.commit()
    return {"detail": "Удалено"}


