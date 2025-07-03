from sqlalchemy.orm import Mapped, mapped_column
from modules.core.models.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)  #ID 
    name: Mapped[str] = mapped_column(nullable=False)              #имя пользователя
    email: Mapped[str] = mapped_column(nullable=False, unique=True)  #Email/Логин
    role: Mapped[str] = mapped_column(nullable=False)              #Роль 
    hashed_password: Mapped[str] = mapped_column(nullable=False)  #Хеш пароля 
