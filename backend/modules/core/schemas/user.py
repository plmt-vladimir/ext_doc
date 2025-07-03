from pydantic import BaseModel, EmailStr
from typing import Optional

#  (регистрация/добавление)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

# вывод информации о пользователе 
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

# Для обновления профиля 
class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None

# Для получения пользователя из БД 
class UserInDB(UserOut):
    hashed_password: str
