from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from modules.core.models.base import Base


#  строительные площадки (высший уровень)
class ConstructionSite(Base):
    __tablename__ = "construction_sites"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Уникальный ID площадки
    full_name = Column(String, nullable=False)  # Полное название строительной площадки
    short_name = Column(String)  # Краткое название (для списков, сокращений)
    address = Column(String)     # Адрес площадки

    objects = relationship("ConstructionObject", back_populates="site", cascade="all, delete-orphan")
#  строительные объекты (здания, сооружения и т.д.)
class ConstructionObject(Base):
    __tablename__ = "construction_objects"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Уникальный ID объекта
    site_id = Column(Integer, ForeignKey("construction_sites.id", ondelete="CASCADE"))  # Привязка к площадке
    full_name = Column(String, nullable=False)  # Полное название объекта
    short_name = Column(String)  # Краткое наименование
    address = Column(String)     # Адрес объекта
    # Обратная связь с площадкой
    site = relationship("ConstructionSite", back_populates="objects")

    # у объекта может быть несколько участков
    zones = relationship("ConstructionZone", back_populates="object", cascade="all, delete-orphan")
# участки (части объекта, например "блок Б", "цех 2")
class ConstructionZone(Base):
    __tablename__ = "construction_zones"

    id = Column(Integer, primary_key=True, autoincrement=True)  # Уникальный ID участка
    object_id = Column(Integer, ForeignKey("construction_objects.id", ondelete="CASCADE"))  # Привязка к объекту
    name = Column(String, nullable=False)   # Название участка (например, "Участок 3")
    address = Column(String)                # Адрес или описание местоположения участка

    # Обратная связь с объектом
    object = relationship("ConstructionObject", back_populates="zones")
