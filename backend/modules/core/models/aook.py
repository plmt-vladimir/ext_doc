from sqlalchemy import Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column
from modules.core.models.base import Base
from datetime import date
from typing import Optional

# (АООК) 
class AOOK(Base):
    __tablename__ = "aooks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)            # Уникальный ID акта
    act_number: Mapped[str]                                                  # Номер акта
    full_name: Mapped[str]                                                   # Полное наименование акта
    status: Mapped[str]                                                      # Статус (например: в работе, подписан)
    start_date: Mapped[date]                                                 # Дата начала работ
    end_date: Mapped[date]                                                   # Дата окончания работ
    sign_date: Mapped[date]                                                  # Дата подписания акта

    zone_id: Mapped[int] = mapped_column(ForeignKey("construction_zones.id"))    # Привязка к участку
    object_id: Mapped[int] = mapped_column(ForeignKey("construction_objects.id"))# Привязка к объекту

    code: Mapped[str] = mapped_column(unique=True)                           # Уникальный код конструкции
    axes: Mapped[str]                                                        # Оси конструкции
    marks: Mapped[str]                                                       # Отметки (высоты)
    notes: Mapped[str]                                                       # Дополнительные сведения

    # Связи с подчинёнными таблицами
    sections = relationship("AOOK_Section", back_populates="aook")
    sp_links = relationship("AOOK_SP", back_populates="aook")
    igs_links = relationship("AOOK_IGS", back_populates="aook")
    labtest_links = relationship("AOOK_LabTest", back_populates="aook")
    responsibles = relationship("AOOK_Responsible", back_populates="aook")
    aosr_links = relationship("AOOK_AOSR", back_populates="aook")
    material_write_offs = relationship("AOOKMaterialWriteOff", back_populates="aook")


#Раздел проекта, по которому выполнена конструкция
class AOOK_Section(Base):
    __tablename__ = "aook_sections"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    title: Mapped[str]                                                   # Название раздела
    code: Mapped[str]                                                    # Код раздела (например, КЖ, АР)
    sheets: Mapped[str]                                                  # Листы проекта

    aook = relationship("AOOK", back_populates="sections")


#Привязка нормативных документов СП к АООК
class AOOK_SP(Base):
    __tablename__ = "aook_sp"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    sp_id: Mapped[int] = mapped_column(ForeignKey("sp.id"))              # Привязка к нормативному документу СП

    aook = relationship("AOOK", back_populates="sp_links")


# Привязка геодезических схем к АООК
class AOOK_IGS(Base):
    __tablename__ = "aook_igs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    igs_id: Mapped[int] = mapped_column(ForeignKey("igs.id"))            # Привязка к геодезической схеме

    aook = relationship("AOOK", back_populates="igs_links")


# Привязка лабораторных исследований к АООК 
class AOOK_LabTest(Base):
    __tablename__ = "aook_labtests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    lab_test_id: Mapped[int] = mapped_column(ForeignKey("labtests.id"))  # Привязка к лабораторному исследованию

    aook = relationship("AOOK", back_populates="labtest_links")


# Ответственные представители по АООК
class AOOK_Responsible(Base):
    __tablename__ = "aook_responsibles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    employee_id: Mapped[int] = mapped_column(ForeignKey("org_employees.id"))  # Привязка к сотруднику

    aook = relationship("AOOK", back_populates="responsibles")


# Связь AOOK > AOSR (связанные акты) 
class AOOK_AOSR(Base):
    __tablename__ = "aook_aosr"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))          # Привязка к акту AOSR

    aook = relationship("AOOK", back_populates="aosr_links")


# Прямое списание материалов на AOOK 
class AOOKMaterialWriteOff(Base):
    __tablename__ = "aook_material_write_offs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aook_id: Mapped[int] = mapped_column(ForeignKey("aooks.id"))         # Привязка к АООК
    delivered_material_id: Mapped[int] = mapped_column(ForeignKey("delivered_materials.id"))  # Какой материал списан
    quantity: Mapped[float]                                              # Количество списанного материала

    aook = relationship("AOOK", back_populates="material_write_offs")


