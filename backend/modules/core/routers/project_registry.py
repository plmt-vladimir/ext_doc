from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from modules.core.models.project_registry import Project, ProjectSection
from modules.core.schemas.project_registry import (
    ProjectIn, ProjectOut,
    ProjectSectionIn, ProjectSectionOut
)
from common.database import get_async_session
from fastapi import Path

router = APIRouter(prefix="/projects", tags=["Project Registry"])


# === Projects ===
@router.post("/", response_model=ProjectOut)
async def create_project(data: ProjectIn, session: AsyncSession = Depends(get_async_session)):
    project = Project(**data.dict())
    session.add(project)
    await session.commit()
    await session.refresh(project)

    return {
        "id": project.id,
        "object_id": project.object_id,
        "name": project.name,
    }


@router.get("/", response_model=list[ProjectOut])
async def list_projects(object_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(Project).where(Project.object_id == object_id)
    result = await session.execute(query)
    return result.scalars().all()


# === Project Sections ===
@router.post("/sections", response_model=ProjectSectionOut)
async def create_section(data: ProjectSectionIn, session: AsyncSession = Depends(get_async_session)):
    section = ProjectSection(**data.dict())
    session.add(section)
    await session.commit()
    await session.refresh(section)
    return section

@router.get("/by-object/{object_id}")
async def get_project_and_sections_by_object(
    object_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    # Получаем проект по object_id
    project_result = await session.execute(
        select(Project).where(Project.object_id == object_id)
    )
    project = project_result.scalar_one_or_none()

    if not project:
        return {"project": None, "sections": []}

    # Получаем разделы проекта
    sections_result = await session.execute(
        select(ProjectSection).where(ProjectSection.project_id == project.id)
    )
    sections = sections_result.scalars().all()

    return {
        "project": {
            "id": project.id,
            "object_id": project.object_id,
            "name": project.name
        },
        "sections": [
            {
                "id": s.id,
                "project_id": s.project_id,
                "section_code": s.section_code,
                "section_name": s.section_name,
                "discipline": s.discipline,
                "designer": s.designer,
                "sheet_info": s.sheet_info
            } for s in sections
        ]
    }

@router.get("/sections", response_model=list[ProjectSectionOut])
async def list_sections(project_id: int, session: AsyncSession = Depends(get_async_session)):
    query = select(ProjectSection).where(ProjectSection.project_id == project_id)
    result = await session.execute(query)
    return result.scalars().all()

@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int = Path(..., description="ID проекта"),
    session: AsyncSession = Depends(get_async_session)
):
    project = await session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    await session.delete(project)
    await session.commit()

@router.delete("/sections/{section_id}", status_code=204)
async def delete_section(
    section_id: int = Path(..., description="ID раздела проекта"),
    session: AsyncSession = Depends(get_async_session)
):
    section = await session.get(ProjectSection, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Раздел проекта не найден")

    await session.delete(section)
    await session.commit()
    
@router.put("/sections/{section_id}", response_model=ProjectSectionOut)
async def update_section(
    section_id: int,
    data: ProjectSectionIn,
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(ProjectSection).where(ProjectSection.id == section_id)
    )
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Раздел проекта не найден")

    for key, value in data.dict().items():
        setattr(section, key, value)

    await session.commit()
    await session.refresh(section)
    return section
