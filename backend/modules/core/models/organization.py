from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from modules.core.models.base import Base
from datetime import date
from typing import Optional

# Организация
class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True) 
    name: Mapped[str]          # Название организации
    ogrn: Mapped[str]          # ОГРН
    inn: Mapped[str]           # ИНН
    address: Mapped[str]       # Адрес
    phone: Mapped[str]         # Телефон

    license_name: Mapped[str]      # Название лицензии 
    license_number: Mapped[str]    # Номер лицензии
    license_date: Mapped[date]     # Дата выдачи лицензии

    sro_name: Mapped[str]      # Название СРО
    sro_number: Mapped[str]    # Номер СРО
    sro_ogrn: Mapped[str]      # ОГРН СРО
    sro_inn: Mapped[str]       # ИНН СРО

    employees = relationship(
        "OrgEmployee",
        back_populates="organization",
        cascade="all, delete-orphan"  
    )  

    roles = relationship(
        "OrgRoleAssignment",
        back_populates="organization",
        cascade="all, delete-orphan"  
    )  


# Сотрудник организации
class OrgEmployee(Base):
    __tablename__ = "org_employees"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)  
    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),  
        nullable=False
    )  # Организация, к которой относится

    full_name: Mapped[str]         # ФИО
    position: Mapped[str]          # Должность
    ins: Mapped[str]               # ИНС 
    decree_number: Mapped[str]     # Номер приказа о назначении
    decree_date: Mapped[date]      # Дата приказа

    organization = relationship("Organization", back_populates="employees")  


# Назначение роли организации на площадке или объекте
class OrgRoleAssignment(Base):
    __tablename__ = "org_role_assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organization_id: Mapped[int] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), 
        nullable=False
    )  # Какая организация

    construction_site_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("construction_sites.id"), nullable=True
    )  # На какой площадке действует

    construction_object_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("construction_objects.id"), nullable=True
    )  # Или на каком объекте

    role_id: Mapped[int] = mapped_column(ForeignKey("org_roles.id"))  

    role = relationship("OrgRole", back_populates="assignments") 
    organization = relationship("Organization", back_populates="roles")  


# Роль в строительстве (например, подрядчик, заказчик, генподрядчик и т. д.)
class OrgRole(Base):
    __tablename__ = "org_roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)  # Уникальный ID роли
    code: Mapped[str] = mapped_column(unique=True)  # Уникальный код (например, ZAK, SUB, GEN)
    name: Mapped[str]                                # Название роли (для отображения)
    description: Mapped[Optional[str]] = mapped_column(nullable=True)  # Описание 

    assignments = relationship("OrgRoleAssignment", back_populates="role")  



