from sqlalchemy import (
    String, Integer, ForeignKey, Float, Text, Date, DateTime, func
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import date
from modules.core.models.base import Base

# связь DeliveredMaterial <-> QualityDocument 
class DeliveredMaterialQualityDoc(Base):
    __tablename__ = "delivered_material_quality_docs"

    delivered_material_id: Mapped[int] = mapped_column(
        ForeignKey("delivered_materials.id", ondelete="CASCADE"), primary_key=True
    )
    quality_doc_id: Mapped[int] = mapped_column(
        ForeignKey("quality_documents.id", ondelete="CASCADE"), primary_key=True
    )
    attached_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), nullable=False)

    delivered_material = relationship("DeliveredMaterial", back_populates="quality_doc_links")
    quality_document = relationship("QualityDocument", back_populates="delivered_material_links")

# Справочник материалов 
class MaterialReference(Base):
    __tablename__ = "material_references"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    type: Mapped[str]
    unit: Mapped[str]

    deliveries = relationship("DeliveredMaterial", back_populates="material")


#Документ о качестве 
class QualityDocument(Base):
    __tablename__ = "quality_documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str]
    number: Mapped[str]
    issue_date: Mapped[date]
    expiry_date: Mapped[date]
    file_url: Mapped[str]

    delivered_material_links = relationship(
        "DeliveredMaterialQualityDoc", 
        back_populates="quality_document", 
        cascade="all, delete-orphan"
    )
    delivered_materials = relationship(
        "DeliveredMaterial", secondary="delivered_material_quality_docs", viewonly=True
    )

#Поставка материалов
class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    supplier: Mapped[str]
    supply_type: Mapped[str]
    record_number: Mapped[str]
    invoice_number: Mapped[str]
    record_date: Mapped[date]
    invoice_date: Mapped[date]
    invoice_file_url: Mapped[str]
    note: Mapped[str]

    # Привязка к стройке / объекту / участку
    site_id: Mapped[int] = mapped_column(ForeignKey("construction_sites.id"))
    object_id: Mapped[int | None] = mapped_column(ForeignKey("construction_objects.id"), nullable=True)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("construction_zones.id"), nullable=True)

    site = relationship("ConstructionSite")
    object = relationship("ConstructionObject")
    zone = relationship("ConstructionZone")

    # Материалы в поставке 
    materials = relationship(
        "DeliveredMaterial", 
        back_populates="delivery", 
        cascade="all, delete-orphan"  
    )

# Позиция в поставке (материал + объём)
class DeliveredMaterial(Base):
    __tablename__ = "delivered_materials"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    delivery_id: Mapped[int] = mapped_column(
        ForeignKey("deliveries.id", ondelete="CASCADE")
    )
    material_id: Mapped[int] = mapped_column(ForeignKey("material_references.id"))
    quantity: Mapped[float]

    delivery = relationship("Delivery", back_populates="materials")
    material = relationship("MaterialReference", back_populates="deliveries")

    quality_doc_links = relationship(
        "DeliveredMaterialQualityDoc", 
        back_populates="delivered_material", 
        cascade="all, delete-orphan" 
    )
    quality_documents = relationship(
        "QualityDocument", secondary="delivered_material_quality_docs", viewonly=True
    )

    write_offs = relationship(
        "StorageWriteOff", 
        back_populates="delivered_material", 
        cascade="all, delete-orphan"  
    )

#Списание со склада
class StorageWriteOff(Base):
    __tablename__ = "storage_write_offs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    delivered_material_id: Mapped[int] = mapped_column(
        ForeignKey("delivered_materials.id", ondelete="CASCADE")  
    )
    zone_id: Mapped[int] = mapped_column(ForeignKey("construction_zones.id"))
    quantity: Mapped[float]
    act_type: Mapped[str]
    act_id: Mapped[int]

    delivered_material = relationship("DeliveredMaterial", back_populates="write_offs")




