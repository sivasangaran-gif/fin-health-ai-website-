from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    currency = Column(String, default="₹")

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("FinancialGoal", back_populates="user", cascade="all, delete-orphan")
    health_scores = relationship("HealthScore", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # Food, Housing, Transport, etc.
    type = Column(String, nullable=False)      # income or expense
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transactions")


class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(Date, nullable=False)

    user = relationship("User", back_populates="goals")


class HealthScore(Base):
    __tablename__ = "health_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)  # 0 to 100
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    ai_insight_text = Column(String, nullable=True)

    user = relationship("User", back_populates="health_scores")
