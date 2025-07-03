from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from common.database import AsyncSessionLocal

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from modules.core.services.auth import decode_access_token
from modules.core.models.user import User
from sqlalchemy import select


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# Для авторизации через Bearer token (JWT)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")  

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    token_data = decode_access_token(token)
    if not token_data or not token_data.email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить учетные данные",
        )
    result = await session.execute(select(User).where(User.email == token_data.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )
    return user

