from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from modules.core.models.base import Base

#Строительные нормативы и правила (СП)
class SP(Base):
    __tablename__ = "sp"

    id: Mapped[int] = mapped_column(primary_key=True)  
    code: Mapped[str] = mapped_column(String, unique=True, nullable=False)  
    name: Mapped[str]  
    pdf_url: Mapped[str]  

