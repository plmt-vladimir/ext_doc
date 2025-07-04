from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from modules.core.models.base import Base
from sqlalchemy import Integer, String, ForeignKey

class QualityDocType(Base):
    __tablename__ = "quality_doc_types"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String, unique=True)
    label: Mapped[str] = mapped_column(String)

class ActStatus(Base):
    __tablename__ = "act_statuses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String, unique=True)
    label: Mapped[str] = mapped_column(String)
    order: Mapped[int] = mapped_column(Integer, default=0)
    
class WorkRegistry(Base):
    __tablename__ = "work_registry"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    object_id: Mapped[int] = mapped_column(ForeignKey("construction_objects.id", ondelete="CASCADE"))
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # Например: "1.1.2"
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # Название: "Свайное поле"

