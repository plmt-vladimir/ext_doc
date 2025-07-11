from pathlib import Path as FilePath
from uuid import uuid4
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import joinedload
from common.minio_client import upload_file_to_minio, delete_file_from_minio
from fastapi.responses import RedirectResponse
from common.minio_client import get_presigned_url
from fastapi import (
    APIRouter, Depends, Query, UploadFile, File, HTTPException, Form, Request
)
from fastapi import Path as ApiPath
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import distinct


from common.database import get_async_session
from modules.core.models.materials import (
    Delivery, MaterialReference, DeliveredMaterial, QualityDocument, DeliveredMaterialQualityDoc
)
from modules.core.schemas.materials import (
    DeliveryOut, DeliveryCreate, DeliveredMaterialOut,
    DeliveredMaterialIn, MaterialReferenceIn, MaterialReferenceOut,
    QualityDocumentOut
)

router = APIRouter(prefix="/deliveries", tags=["Materials"])

# Открытие по пресайнду файла накладной 
@router.get("/invoices/view/{delivery_id}")
async def view_invoice_file(delivery_id: int, db: AsyncSession = Depends(get_async_session)):
    delivery = await db.get(Delivery, delivery_id)
    if not delivery or not delivery.invoice_file_url:
        raise HTTPException(404, detail="Файл не найден")
    
    return RedirectResponse(get_presigned_url(delivery.invoice_file_url))
# Открытие по пресайнду файла документа о качестве
@router.get("/quality-documents/view/{doc_id}")
async def view_quality_doc(doc_id: int, db: AsyncSession = Depends(get_async_session)):
    doc = await db.get(QualityDocument, doc_id)
    if not doc:
        raise HTTPException(404, detail="Документ не найден")

    return RedirectResponse(get_presigned_url(doc.file_url))
#Загрузка PDF накладной
@router.post("/upload-invoice")
async def upload_invoice_file(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(400, detail="Только PDF разрешены")

    file_bytes = await file.read()
    object_name = upload_file_to_minio(file_bytes, filename, folder="invoices")
    return {"file_url": object_name}
# Загрузка PDF документа о качестве
@router.post("/upload-quality-doc")
async def upload_quality_document(
    file: UploadFile = File(...),
    type: str = Form(...),
    number: str = Form(...),
    issue_date: str = Form(...),
    expiry_date: str = Form(...),
    db: AsyncSession = Depends(get_async_session)
):
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(400, detail="Только PDF разрешены")

    try:
        issue_date_parsed = datetime.strptime(issue_date, "%Y-%m-%d").date()
        expiry_date_parsed = datetime.strptime(expiry_date, "%Y-%m-%d").date()
    except Exception as e:
        raise HTTPException(400, detail=f"Неверный формат даты: {e}")

    file_bytes = await file.read()
    object_name = upload_file_to_minio(file_bytes, filename, folder="quality_docs")

    doc = QualityDocument(
        type=type,
        number=number,
        issue_date=issue_date_parsed,
        expiry_date=expiry_date_parsed,
        file_url=object_name
    )

    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return QualityDocumentOut.from_orm(doc)
#Проверка используется ли тип материала (при обновлении)
@router.get("/material-references/{id}/usage", response_model=dict)
async def material_usage(id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(DeliveredMaterial).where(DeliveredMaterial.material_id == id)
    )
    used = result.first()
    return {"used": bool(used)}
#Получение списка справочника материалов
@router.get("/material-references", response_model=list[MaterialReferenceOut])
async def list_material_references(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(MaterialReference))
    return result.scalars().all()
# Создание типа материала
@router.post("/material-references", response_model=MaterialReferenceOut)
async def create_material_reference(
    data: MaterialReferenceIn,
    db: AsyncSession = Depends(get_async_session),
):
    material = MaterialReference(**data.dict())
    db.add(material)
    await db.commit()
    await db.refresh(material)
    return material
# Обновление тип материала 
@router.patch("/material-references/{id}", response_model=MaterialReferenceOut)
async def update_material_reference(
    id: int,
    data: MaterialReferenceIn,
    db: AsyncSession = Depends(get_async_session),
):
    material = await db.get(MaterialReference, id)
    if not material:
        raise HTTPException(404, detail="Материал не найден")
    for k, v in data.dict().items():
        setattr(material, k, v)
    await db.commit()
    await db.refresh(material)
    return material

# Удаление типа материала 
@router.delete("/material-references/{id}", response_model=dict)
async def delete_material_reference(
    id: int,
    db: AsyncSession = Depends(get_async_session),
):
    material = await db.get(MaterialReference, id)
    if not material:
        raise HTTPException(404, detail="Материал не найден")
    result = await db.execute(
        select(DeliveredMaterial).where(DeliveredMaterial.material_id == id)
    )
    used = result.first()
    if used:
        raise HTTPException(
            status_code=400, 
            detail="Нельзя удалить: тип материала задействован в других поставках или актах"
        )
    await db.delete(material)
    await db.commit()
    return {"ok": True}
# Получение списка поставок с фильтрацией
@router.get("/", response_model=list[DeliveryOut])
async def list_deliveries(
    site_id: Optional[int] = Query(None),
    object_id: Optional[int] = Query(None),
    zone_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_async_session),
):
    query = select(Delivery)
    if site_id:
        query = query.where(Delivery.site_id == site_id)
    if object_id:
        query = query.where(Delivery.object_id == object_id)
    if zone_id:
        query = query.where(Delivery.zone_id == zone_id)

    result = await db.execute(query)
    return result.scalars().all()
#Получение списка документов о качестве 
@router.get("/quality-documents", response_model=list[QualityDocumentOut])
async def list_quality_documents(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(QualityDocument))
    docs = result.scalars().all()
    docs_out = []
    for doc in docs:
        links_result = await db.execute(
            select(DeliveredMaterialQualityDoc).where(
                DeliveredMaterialQualityDoc.quality_doc_id == doc.id
            )
        )
        links = links_result.scalars().all()
        material_names = []
        for link in links:
            delivered_material = await db.get(DeliveredMaterial, link.delivered_material_id)
            if delivered_material:
                mat_ref = await db.get(MaterialReference, delivered_material.material_id)
                if mat_ref and mat_ref.name not in material_names:
                    material_names.append(mat_ref.name)  
        docs_out.append(QualityDocumentOut(
            id=doc.id,
            type=doc.type,
            number=doc.number,
            issue_date=doc.issue_date,
            expiry_date=doc.expiry_date,
            file_url=doc.file_url,
            materials=material_names
        ))

    return docs_out
#Обновление документа о качестве
@router.put("/quality-documents/{id}", response_model=QualityDocumentOut)
async def update_quality_document(
    id: int = ApiPath(...),
    file: Optional[UploadFile] = File(None),
    type: Optional[str] = Query(None),
    number: Optional[str] = Query(None),
    issue_date: Optional[str] = Query(None),
    expiry_date: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(select(QualityDocument).where(QualityDocument.id == id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Документ не найден")
    if type is not None:
        doc.type = type
    if number is not None:
        doc.number = number
    if issue_date is not None:
        doc.issue_date = datetime.strptime(issue_date, '%Y-%m-%d').date()
    if expiry_date is not None:
        doc.expiry_date = datetime.strptime(expiry_date, '%Y-%m-%d').date()

    if file and file.filename:
        file_bytes = await file.read()
        object_name = upload_file_to_minio(file_bytes, file.filename, folder="quality_docs")
        doc.file_url = object_name
    else:
        raise HTTPException(status_code=400, detail="File must be provided")

    await db.commit()
    await db.refresh(doc)
    return QualityDocumentOut.from_orm(doc)
#Список поставщиков
@router.get("/suppliers", response_model=list[str])
async def get_suppliers(
    site_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_async_session),
):
    query = select(distinct(Delivery.supplier))
    if site_id:
        query = query.where(Delivery.site_id == site_id)
    result = await db.execute(query)
    return [row[0] for row in result.fetchall() if row[0]]
#  Получение доступных материалов стройке (опционально по объекту/участку)
@router.get("/available", response_model=List[DeliveredMaterialOut])
async def get_available_materials(
    site_id: int = Query(..., description="ID стройки (site_id)"),
    object_id: Optional[int] = Query(None, description="ID объекта (object_id)"),
    zone_id: Optional[int] = Query(None, description="ID участка (zone_id)"),
    session: AsyncSession = Depends(get_async_session)
):
    query = select(Delivery.id).where(Delivery.site_id == site_id)
    if object_id:
        query = query.where(Delivery.object_id == object_id)
    if zone_id:
        query = query.where(Delivery.zone_id == zone_id)

    deliveries_result = await session.execute(query)
    delivery_ids = [row[0] for row in deliveries_result.fetchall()]
    if not delivery_ids:
        return []

    materials_query = (
        select(DeliveredMaterial)
        .options(
            joinedload(DeliveredMaterial.material),
            joinedload(DeliveredMaterial.delivery),
            joinedload(DeliveredMaterial.quality_documents), 
        )
        .where(DeliveredMaterial.delivery_id.in_(delivery_ids))
    )

    result = await session.execute(materials_query)
    all_materials = result.unique().scalars().all()

    return [DeliveredMaterialOut.from_orm(m) for m in all_materials]

# Создание новой поставки 
@router.post("/", response_model=dict)
async def create_delivery_json(
    data: DeliveryCreate,
    db: AsyncSession = Depends(get_async_session)
):
    delivery = Delivery(
        site_id=data.site_id,
        object_id=data.object_id,
        zone_id=data.zone_id,
        supplier=data.supplier,
        supply_type=data.supply_type,
        record_number=data.record_number,
        record_date=data.record_date,
        invoice_number=data.invoice_number,
        invoice_date=data.invoice_date,
        invoice_file_url=data.invoice_file_url,
        note=data.note,
    )
    db.add(delivery)
    await db.flush()

    for mat in data.materials:
        delivered = DeliveredMaterial(
            delivery_id=delivery.id,
            material_id=mat.material_id,
            quantity=mat.quantity,
        )
        db.add(delivered)
        await db.flush()
        # Добавляем связи с сертификатами
        for doc_id in mat.quality_doc_ids:
            link = DeliveredMaterialQualityDoc(
                delivered_material_id=delivered.id,
                quality_doc_id=doc_id
            )
            db.add(link)
    await db.commit()
    return {"id": delivery.id}
#Удаление поставки 
@router.delete("/{delivery_id}")
async def delete_delivery(delivery_id: int, db: AsyncSession = Depends(get_async_session)):
    delivery = await db.get(Delivery, delivery_id)
    if not delivery:
        raise HTTPException(404, detail="Поставка не найдена")
    await db.delete(delivery)
    await db.commit()
    return {"result": "ok"}


