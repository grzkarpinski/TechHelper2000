import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from backend.config import get_allowed_origins, validate_environment
from backend.database import AsyncSessionLocal, init_db
from backend.models import User
from backend.routers.auth import router as auth_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="Machining Helper API")
app.include_router(auth_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    validate_environment()
    await init_db()

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.role == "admin", User.is_active.is_(True)).limit(1))
        active_admin = result.scalar_one_or_none()
        if active_admin is None:
            logger.warning("Brak aktywnego konta admin. Uruchom backend/create_admin.py.")


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
