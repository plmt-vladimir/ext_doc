from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
import logging

# Импорт роутеров
from modules.core.routers import igs, construction, labtest, materials, organization, aosr, dictionaries, sp, user, project_registry
from modules.core.routers import auth_router

# Настройка логгера
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ExecutiveDoc")

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Создание папок для хранения файлов ===
DATA_DIRS = {
    "igs": Path("data/igs"),
    "labtests": Path("data/labtests"),
    "invoices": Path("data/invoices"),
    "quality_docs": Path("data/quality_docs"),
    "sp" : Path("data/sp"),
}

for name, path in DATA_DIRS.items():
    path.mkdir(parents=True, exist_ok=True)
    if not os.access(path, os.W_OK):
        logger.warning(f"Нет прав на запись в {path.resolve()} — загрузка {name.upper()} может не работать!")
    else:
        logger.info(f"Папка для {name.upper()} готова: {path.resolve()}")

# === Раздача файлов ===
app.mount("/files/igs", StaticFiles(directory=DATA_DIRS["igs"]), name="igs_files")
app.mount("/files/labtests", StaticFiles(directory=DATA_DIRS["labtests"]), name="labtest_files")
app.mount("/files/invoices", StaticFiles(directory=DATA_DIRS["invoices"]), name="invoice_files")
app.mount("/files/quality_docs", StaticFiles(directory=DATA_DIRS["quality_docs"]), name="quality_doc_files")
app.mount("/files/sp", StaticFiles(directory=DATA_DIRS["sp"]), name="sp_files")

# === Роуты ===
app.include_router(auth_router.router)
app.include_router(igs.router)
app.include_router(construction.router)
app.include_router(labtest.router)
app.include_router(materials.router)
app.include_router(organization.router)
app.include_router(aosr.router)
app.include_router(dictionaries.router)
app.include_router(sp.router)
app.include_router(user.router)
app.include_router(project_registry.router)