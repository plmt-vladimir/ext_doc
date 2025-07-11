import mimetypes
import io
from minio import Minio
from uuid import uuid4
import os
from datetime import timedelta

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "aid-project-files")

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def ensure_bucket():
    if not minio_client.bucket_exists(MINIO_BUCKET):
        minio_client.make_bucket(MINIO_BUCKET)

def upload_file_to_minio(file_bytes: bytes, filename: str, folder: str = "") -> str:
    ensure_bucket()

    ext = filename.split('.')[-1]
    object_name = f"{folder}/{uuid4()}.{ext}" if folder else f"{uuid4()}.{ext}"

    content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    stream = io.BytesIO(file_bytes)

    minio_client.put_object(
        bucket_name=MINIO_BUCKET,
        object_name=object_name,
        data=stream,
        length=len(file_bytes),
        content_type=content_type,
        metadata={
            "Content-Disposition": "inline"
        }
    )

    return object_name

def get_presigned_url(object_name: str, expires_sec: int = 3600) -> str:
    return minio_client.presigned_get_object(
        bucket_name=MINIO_BUCKET,
        object_name=object_name,
        expires=timedelta(seconds=expires_sec),
        response_headers={
            "response-content-disposition": "inline"
        }
    )

def delete_file_from_minio(object_name: str):
    try:
        minio_client.remove_object(MINIO_BUCKET, object_name)
    except Exception as e:
        print(f"[MinIO] Ошибка удаления файла {object_name}: {e}")

