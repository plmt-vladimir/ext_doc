from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from modules.core.models.base import Base
from typing import Optional
from datetime import date

# Реест/Передаточные документы
class TransferDocument(Base):
    __tablename__ = "transfer_documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)  # PK
    title: Mapped[str]  # Название документа
    number: Mapped[str]  # Номер документа
    date: Mapped[date]  # Дата
    file_url: Mapped[str]  # Ссылка на файл

    links = relationship("TransferDocumentLink", back_populates="document")  # связи с актами

# Промежуточная таблица: связи с актами
class TransferDocumentLink(Base):
    __tablename__ = "transfer_document_links"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)  # PK
    transfer_document_id: Mapped[int] = mapped_column(ForeignKey("transfer_documents.id"))  # FK на документ
    aook_id: Mapped[Optional[int]] = mapped_column(ForeignKey("aooks.id"), nullable=True)   # FK на AOOK
    aosr_id: Mapped[Optional[int]] = mapped_column(ForeignKey("aosr.id"), nullable=True)    # FK на AOSR

    document = relationship("TransferDocument", back_populates="links")

