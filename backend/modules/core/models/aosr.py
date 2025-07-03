from datetime import date  # ← Python-тип для Mapped[date]
from sqlalchemy import String, Integer, ForeignKey, Float, Date
from sqlalchemy.orm import relationship, Mapped, mapped_column
from modules.core.models.base import Base

# (АОСР) 
class AOSR(Base):
    __tablename__ = "aosr"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)      # Уникальный идентификатор акта
    act_number: Mapped[str]                                            # Номер акта
    full_name: Mapped[str]                                             # Полное наименование акта
    start_date: Mapped[date] = mapped_column(Date)                     # Дата начала работ
    end_date: Mapped[date] = mapped_column(Date)                       # Дата окончания работ
    sign_date: Mapped[date] = mapped_column(Date)                      # Дата подписания акта
    status: Mapped[str]                                                # Статус акта (в работе, подписан и т.д.)
    registry_code: Mapped[str]                                         # Код из проектного реестра
    type_code: Mapped[str]                                             # Тип работы
    aook_code: Mapped[str]                                             # Код AOOK (уникальный)

    zone_id: Mapped[int] = mapped_column(ForeignKey("construction_zones.id"))      # Привязка к участку
    object_id: Mapped[int] = mapped_column(ForeignKey("construction_objects.id"))  # Привязка к объекту
    axes: Mapped[str]                                                 # Оси (по таблице)
    marks: Mapped[str]                                                # Отметки (высоты)
    work_type_label: Mapped[str]                                      # Название типа работ (по таблице)

    sections = relationship("AOSRSection", back_populates="aosr")
    sps = relationship("AOSR_SP", back_populates="aosr")
    igs = relationship("AOSR_IGS", back_populates="aosr")
    labtests = relationship("AOSR_LabTest", back_populates="aosr")
    responsibles = relationship("AOSRResponsible", back_populates="aosr")
    material_write_offs = relationship("AOSRMaterialWriteOff", back_populates="aosr")


#Раздел проекта, по которому выполнены работы 
class AOSRSection(Base):
    __tablename__ = "aosr_sections"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))        # Привязка к акту
    title: Mapped[str]                                                 # Название раздела
    code: Mapped[str]                                                  # Код раздела (КЖ, АР и др.)
    sheets: Mapped[str]                                                # Листы проекта

    aosr = relationship("AOSR", back_populates="sections")


# Привязка нормативных документов СП к АОСР 
class AOSR_SP(Base):
    __tablename__ = "aosr_sp"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))        # Привязка к акту
    sp_id: Mapped[int] = mapped_column(ForeignKey("sp.id"))            # Привязка к СП

    aosr = relationship("AOSR", back_populates="sps")


# Привязка геодезических схем к АОСР 
class AOSR_IGS(Base):
    __tablename__ = "aosr_igs"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))        # Привязка к акту
    igs_id: Mapped[int] = mapped_column(ForeignKey("igs.id"))          # Привязка к ИГС

    aosr = relationship("AOSR", back_populates="igs")


# Привязка лабораторных исследований к АОСР 
class AOSR_LabTest(Base):
    __tablename__ = "aosr_labtests"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))            # Привязка к акту
    lab_test_id: Mapped[int] = mapped_column(ForeignKey("labtests.id"))    # Привязка к лабораторному документу

    aosr = relationship("AOSR", back_populates="labtests")


# Ответственные представители по АОСР 
class AOSRResponsible(Base):
    __tablename__ = "aosr_responsibles"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))              # Привязка к акту
    employee_id: Mapped[int] = mapped_column(ForeignKey("org_employees.id")) # Привязка к сотруднику

    aosr = relationship("AOSR", back_populates="responsibles")


# Списанные материалы, привязанные к АОСР 
class AOSRMaterialWriteOff(Base):
    __tablename__ = "aosr_material_write_offs"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    aosr_id: Mapped[int] = mapped_column(ForeignKey("aosr.id"))                         # Привязка к акту
    delivered_material_id: Mapped[int] = mapped_column(ForeignKey("delivered_materials.id"))  # Привязка к списанному материалу
    quantity: Mapped[float] = mapped_column(Float)                                      # Количество списанного материала

    aosr = relationship("AOSR", back_populates="material_write_offs")




