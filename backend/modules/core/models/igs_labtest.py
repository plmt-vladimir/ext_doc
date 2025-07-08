from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Date, ForeignKey
from modules.core.models.base import Base
from datetime import date

# ИГС 
class IGS(Base):
    __tablename__ = "igs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)          # Уникальный ID схемы
    title: Mapped[str] = mapped_column(String)                             # Название схемы
    axes: Mapped[str] = mapped_column(String)                              # Оси 
    marks: Mapped[str] = mapped_column(String)                             # Отметки 
    date: Mapped[date] = mapped_column(Date)                               # Дата документа
    file_url: Mapped[str] = mapped_column(String)                          # Ссылка на файл 

    site_id: Mapped[int] = mapped_column(ForeignKey("construction_sites.id"))                 # Привязка к строительной площадке 
    object_id: Mapped[int | None] = mapped_column(ForeignKey("construction_objects.id"), nullable=True)  # Привязка к объекту 
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("construction_zones.id"), nullable=True)      # Привязка к участку 

# Лабораторное испытание
class LabTest(Base):
    __tablename__ = "labtests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)          # Уникальный ID испытания
    title: Mapped[str] = mapped_column(String)                             # Название протокола
    axes: Mapped[str] = mapped_column(String)                              # Оси
    marks: Mapped[str] = mapped_column(String)                             # Отметки 
    date: Mapped[date] = mapped_column(Date)                               # Дата протокола
    file_url: Mapped[str] = mapped_column(String)                          # Ссылка на файл

    site_id: Mapped[int] = mapped_column(ForeignKey("construction_sites.id"))                 # Привязка к строительной площадке 
    object_id: Mapped[int | None] = mapped_column(ForeignKey("construction_objects.id"), nullable=True)  # Привязка к объекту 
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("construction_zones.id"), nullable=True)      # Привязка к участку 


