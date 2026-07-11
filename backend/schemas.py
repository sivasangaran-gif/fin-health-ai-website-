from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# User Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    currency: Optional[str] = "₹"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float = Field(gt=0, description="Amount must be positive")
    category: str = Field(..., description="e.g. Food, Housing, Transport, Salary")
    type: str = Field(..., pattern="^(income|expense)$", description="Must be 'income' or 'expense'")

class TransactionCreate(TransactionBase):
    timestamp: Optional[datetime.datetime] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

# Financial Goal Schemas
class GoalBase(BaseModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: Optional[float] = 0.0
    target_date: datetime.date

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Health Score Schemas
class HealthScoreBase(BaseModel):
    score: int = Field(ge=0, le=100)
    ai_insight_text: Optional[str] = None

class HealthScoreResponse(HealthScoreBase):
    id: int
    user_id: int
    generated_at: datetime.datetime

    class Config:
        from_attributes = True
