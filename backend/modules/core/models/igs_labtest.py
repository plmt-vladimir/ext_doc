from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Date, ForeignKey
from modules.core.models.base import Base
from datetime import date

# === Модель: ИГС (исполнительная геодезическая схема) ===
class IGS(Base):
    __tablename__ = "igs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)          # Уникальный ID схемы
    title: Mapped[str] = mapped_column(String)                             # Название схемы
    axes: Mapped[str] = mapped_column(String)                              # Оси (например, 1–3 / А–В)
    marks: Mapped[str] = mapped_column(String)                             # Отметки (высоты)
    date: Mapped[date] = mapped_column(Date)                               # Дата документа
    file_url: Mapped[str] = mapped_column(String)                          # Ссылка на файл (PDF/чертёж)

    site_id: Mapped[int] = mapped_column(ForeignKey("construction_sites.id"))                 # Привязка к строительной площадке (обязательно)
    object_id: Mapped[int | None] = mapped_column(ForeignKey("construction_objects.id"), nullable=True)  # Привязка к объекту (если задан)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("construction_zones.id"), nullable=True)      # Привязка к участку (если задан)

# === Модель: лабораторное испытание ===
class LabTest(Base):
    __tablename__ = "labtests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)          # Уникальный ID испытания
    title: Mapped[str] = mapped_column(String)                             # Название протокола
    axes: Mapped[str] = mapped_column(String)                              # Оси
    marks: Mapped[str] = mapped_column(String)                             # Отметки (высоты)
    date: Mapped[date] = mapped_column(Date)                               # Дата протокола
    file_url: Mapped[str] = mapped_column(String)                          # Ссылка на файл

    site_id: Mapped[int] = mapped_column(ForeignKey("construction_sites.id"))                 # Привязка к строительной площадке (обязательно)
    object_id: Mapped[int | None] = mapped_column(ForeignKey("construction_objects.id"), nullable=True)  # Привязка к объекту (если задан)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("construction_zones.id"), nullable=True)      # Привязка к участку (если задан)


