from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from modules.core.models.base import Base
from typing import Optional

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    object_id: Mapped[int] = mapped_column(ForeignKey("construction_objects.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)  # Например: "Проект объекта X"
    
    sections = relationship("ProjectSection", back_populates="project", cascade="all, delete-orphan")

class ProjectSection(Base):
    __tablename__ = "project_sections"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    section_code: Mapped[str] = mapped_column(String(100))        # Шифр
    section_name: Mapped[str] = mapped_column(String(255))        # Конструкции металлические
    discipline: Mapped[Optional[str]] = mapped_column(String(50)) # Раздел проекта
    designer: Mapped[Optional[str]] = mapped_column(String(255))  # Проектная организация
    sheet_info: Mapped[Optional[str]] = mapped_column(String(255))  # Номера листов, напр. "лист 1-120"

    project = relationship("Project", back_populates="sections")

