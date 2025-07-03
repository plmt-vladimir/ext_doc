from pydantic import BaseModel

# Схема для входа (логина)
class LoginForm(BaseModel):
    username: str  
    password: str

# Схема токена 
class Token(BaseModel):
    access_token: str
    token_type: str

# Схема токена для валидации 
class TokenData(BaseModel):
    email: str | None = None

# Схема смены пароля
class PasswordChange(BaseModel):
    old_password: str
    new_password: str
