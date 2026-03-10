from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.config import get_env

ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_secret_key() -> str:
    secret_key = get_env("SECRET_KEY")
    if len(secret_key) < 32:
        raise RuntimeError("Brakuje poprawnej zmiennej SECRET_KEY w pliku .env")
    return secret_key


def get_jwt_expire_hours() -> int:
    return int(get_env("JWT_EXPIRE_HOURS", "8"))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str) -> str:
    expires_delta = timedelta(hours=get_jwt_expire_hours())
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, get_secret_key(), algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, get_secret_key(), algorithms=[ALGORITHM])
    except JWTError as error:
        raise ValueError("Nieprawidlowy token uwierzytelniajacy") from error
