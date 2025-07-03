from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from modules.core.schemas.user import UserOut, UserCreate, UserUpdate
from modules.core.models.user import User
from modules.core.services.auth import get_password_hash, verify_password
from common.dependencies import get_session, get_current_user
from modules.core.schemas.auth import  PasswordChange
from sqlalchemy import select

router = APIRouter(prefix="/users", tags=["Пользователи"])
# Сброас пароля 
@router.post("/{user_id}/reset-password")
async def reset_password(
    user_id: int,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.hashed_password = get_password_hash("Password")
    await db.commit()
    return {"ok": True, "detail": "Пароль сброшен на Password"}
# Получить текущего пользователя (по токену)
@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Получить список пользователей
@router.get("/", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(User))
    return res.scalars().all()

# Добавить пользователя
@router.post("/", response_model=UserOut)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_session)):
    # Проверка email на уникальность
    res = await db.execute(select(User).where(User.email == user_in.email))
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    user = User(
        name=user_in.name,
        email=user_in.email,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# Обновить пользователя
@router.patch("/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user_in: UserUpdate, db: AsyncSession = Depends(get_session)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    for k, v in user_in.dict(exclude_unset=True).items():
        setattr(user, k, v)
    await db.commit()
    await db.refresh(user)
    return user

# Смена пароля
@router.post("/change-password")
async def change_password(
    data: PasswordChange,
    db: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Старый пароль неверный")
    current_user.hashed_password = get_password_hash(data.new_password)
    await db.commit()
    return {"ok": True}
