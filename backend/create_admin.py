import asyncio
import getpass
import sys
from pathlib import Path

from sqlalchemy import select

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parent.parent))

from backend.database import AsyncSessionLocal, init_db
from backend.models import User
from backend.services.security import hash_password


async def create_admin() -> None:
    await init_db()

    username = input("Podaj login admina: ").strip()
    password = getpass.getpass("Podaj haslo admina: ").strip()

    if len(username) < 3:
        raise ValueError("Login musi miec co najmniej 3 znaki")
    if len(password) < 8:
        raise ValueError("Haslo musi miec co najmniej 8 znakow")

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.username == username))
        existing_user = result.scalar_one_or_none()
        if existing_user is not None:
            raise ValueError("Uzytkownik o takim loginie juz istnieje")

        session.add(
            User(
                username=username,
                hashed_password=hash_password(password),
                role="admin",
                is_active=True,
            )
        )
        await session.commit()

    print("Konto admina zostalo utworzone.")


if __name__ == "__main__":
    asyncio.run(create_admin())
