import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from slowapi.errors import RateLimitExceeded
from slowapi.extension import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware

from backend.config import get_allowed_origins, get_env, validate_environment
from backend.database import AsyncSessionLocal, init_db
from backend.limiter import limiter
from backend.models import User
from backend.routers.auth import router as auth_router
from backend.routers.admin import router as admin_router
from backend.routers.calculators import router as calculators_router
from backend.routers.drills import router as drills_router
from backend.routers.milling_cutters import router as milling_cutters_router
from backend.routers.milling_heads import router as milling_heads_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_static_dir() -> Path:
    static_dir = get_env("STATIC_DIR", "frontend/dist")
    return Path(static_dir).resolve()


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_environment()
    await init_db()

    app.state.static_dir = get_static_dir()
    if not app.state.static_dir.exists():
        logger.warning("Nie znaleziono katalogu statycznego frontendu: %s", app.state.static_dir)

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.role == "admin", User.is_active.is_(True)).limit(1))
        active_admin = result.scalar_one_or_none()
        if active_admin is None:
            logger.warning("Brak aktywnego konta admin. Uruchom backend/create_admin.py.")

    yield


app = FastAPI(title="Machining Helper API", lifespan=lifespan)
app.state.limiter = limiter
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(calculators_router)
app.include_router(milling_heads_router)
app.include_router(milling_cutters_router)
app.include_router(drills_router)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SlowAPIMiddleware)


@app.middleware("http")
async def spa_fallback_middleware(request: Request, call_next):
    response = await call_next(request)
    if response.status_code != 404:
        return response

    if request.method not in {"GET", "HEAD"}:
        return response

    if request.url.path.startswith("/api"):
        return response

    static_dir: Path = request.app.state.static_dir
    index_path = static_dir / "index.html"
    if not index_path.exists():
        return response

    return FileResponse(index_path)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.mount(
    "/",
    StaticFiles(directory=str(get_static_dir()), html=True, check_dir=False),
    name="frontend",
)
