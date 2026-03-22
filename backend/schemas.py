from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int


class LoginRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: Literal["admin", "user"]
    is_active: bool
    created_at: datetime


class MillingCalculationRequest(BaseModel):
    vc: float | None = Field(default=None, gt=0)
    n: float | None = Field(default=None, gt=0)
    fz: float | None = Field(default=None, gt=0)
    f: float | None = Field(default=None, gt=0)
    d: float = Field(gt=0)
    z: int = Field(gt=0)
    ap: float | None = Field(default=None, gt=0)
    ae: float | None = Field(default=None, gt=0)


class MillingCalculationResponse(BaseModel):
    vc: float
    n: float
    fz: float
    f: float
    q: float | None = None


class DrillingCalculationRequest(BaseModel):
    vc: float | None = Field(default=None, gt=0)
    n: float | None = Field(default=None, gt=0)
    fn: float | None = Field(default=None, gt=0)
    f: float | None = Field(default=None, gt=0)
    d: float = Field(gt=0)


class DrillingCalculationResponse(BaseModel):
    vc: float
    n: float
    fn: float
    f: float


class CostOperationRequest(BaseModel):
    group_id: str = Field(min_length=1)
    tpz: float = Field(gt=0)
    tj: float = Field(gt=0)


class CostOperationResult(BaseModel):
    group_id: str
    rate: float
    tpz: float
    tj: float
    cost_tpz: float
    cost_tj: float
    total: float


class CostCalculationResponse(BaseModel):
    operations: list[CostOperationResult]
    total: float


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    role: Literal["admin", "user"] = "user"
    is_active: bool = True


class UserUpdate(BaseModel):
    role: Literal["admin", "user"] | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
