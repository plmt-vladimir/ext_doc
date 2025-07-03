from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from modules.core.models.base import Base

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

