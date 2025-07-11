@echo off
REM ЗАПУСК MINIO 
REM Открываем MinIO 
start "MinIO" "C:\MinIO\minio.exe" server "C:\MinIO\data" --console-address ":9001"

REM Подождать 2 секунды
timeout /t 2 >nul

REM  ЗАПУСК FASTAPI 
REM Переходим в папку backend проекта
cd /d C:\Users\User\my-project\backend

REM Запускаем FastAPI через uvicorn
uvicorn main:app --reload

REM Пауза если что-то упадёт
pause
