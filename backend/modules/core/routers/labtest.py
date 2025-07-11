from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path

from modules.core.models.igs_labtest import LabTest
from modules.core.schemas.labtest import LabTestSchema, LabTestOut
from common.database import get_async_session
from common.minio_client import upload_file_to_minio, delete_file_from_minio, get_presigned_url
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/labtests", tags=["LabTests"])


# Открытие файла через пресайнд
@router.get("/files/{object_path:path}")
async def get_file(object_path: str):
    url = get_presigned_url(object_path)
    return RedirectResponse(url)


# Загрузка PDF-файла
@router.post("/upload")
async def upload_labtest_file(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower().lstrip(".")
    if ext != "pdf":
        raise HTTPException(status_code=400, detail="Только PDF разрешены")

    file_bytes = await file.read()
    filename = file.filename or "labtest.pdf"
    object_name = upload_file_to_minio(file_bytes, filename, folder="labtests")

    return {"file_url": object_name}


# Создание
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


# Получение списка
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


# Обновление
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
        delete_file_from_minio(labtest.file_url)

    for field, value in data.dict().items():
        setattr(labtest, field, value)

    await session.commit()
    await session.refresh(labtest)
    return {"detail": "Обновлено"}


# Удаление
@router.delete("/{labtest_id}")
async def delete_labtest(
    labtest_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(LabTest).where(LabTest.id == labtest_id))
    labtest = result.scalar_one_or_none()

    if not labtest:
        raise HTTPException(status_code=404, detail="Лабораторное испытание не найдено")

    if labtest.file_url:
        delete_file_from_minio(labtest.file_url)

    await session.delete(labtest)
    await session.commit()
    return {"detail": "Удалено"}



