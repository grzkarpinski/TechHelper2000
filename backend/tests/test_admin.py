import pytest

from backend.schemas import UserCreate, UserUpdate
from backend.services.security import hash_password, verify_password


def test_user_create_schema_validates_short_username() -> None:
    with pytest.raises(Exception):
        UserCreate(username="ab", password="password123", role="user")


def test_user_create_schema_validates_short_password() -> None:
    with pytest.raises(Exception):
        UserCreate(username="testuser", password="short", role="user")


def test_user_create_schema_validates_invalid_role() -> None:
    with pytest.raises(Exception):
        UserCreate(username="testuser", password="password123", role="superadmin")


def test_user_create_schema_defaults() -> None:
    user = UserCreate(username="testuser", password="password123")
    assert user.role == "user"
    assert user.is_active is True


def test_user_update_schema_all_none_by_default() -> None:
    update = UserUpdate()
    assert update.role is None
    assert update.is_active is None
    assert update.password is None


def test_user_update_schema_partial_fields() -> None:
    update = UserUpdate(role="admin", is_active=False)
    assert update.role == "admin"
    assert update.is_active is False
    assert update.password is None


def test_user_update_validates_short_password() -> None:
    with pytest.raises(Exception):
        UserUpdate(password="short")


def test_password_hashing_roundtrip() -> None:
    plain = "securepassword123"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed)


def test_password_hashing_rejects_wrong_password() -> None:
    hashed = hash_password("correctpassword1")
    assert not verify_password("wrongpassword11", hashed)
