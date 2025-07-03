from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, Text
from typing import Optional
from modules.core.models.base import Base

class ProjectRegistry(Base):
    __tablename__ = "project_registry"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("project_registry.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255))
    code: Mapped[str] = mapped_column(String(100))
    level: Mapped[int]
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    parent = relationship("ProjectRegistry", remote_side=[id], backref="children")


