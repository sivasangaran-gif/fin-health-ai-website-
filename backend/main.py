from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
import hashlib
from typing import List, Optional

from .database import Base, engine, get_db
from . import models, schemas

# Initialize FastAPI application
app = FastAPI(
    title="FinHealth API",
    description="Backend API framework for AI Financial Health Score Platform",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create SQLite database tables on startup
Base.metadata.create_all(bind=engine)


# Helper function to seed database if empty
def seed_database(db: Session):
    # Check if a user exists
    user = db.query(models.User).first()
    if not user:
        # Create default user: Rahul Verma
        password_hash = hashlib.sha256("password123".encode()).hexdigest()
        user = models.User(
            email="rahul.verma@example.com",
            password_hash=password_hash,
            full_name="Rahul Verma",
            currency="₹"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create default transactions
        txs = [
            models.Transaction(user_id=user.id, amount=2450, category="Food", type="expense", timestamp=datetime.datetime(2026, 7, 9)),
            models.Transaction(user_id=user.id, amount=125000, category="Salary", type="income", timestamp=datetime.datetime(2026, 7, 8)),
            models.Transaction(user_id=user.id, amount=1850, category="Housing", type="expense", timestamp=datetime.datetime(2026, 7, 5)),
            models.Transaction(user_id=user.id, amount=320, category="Transport", type="expense", timestamp=datetime.datetime(2026, 7, 4)),
            models.Transaction(user_id=user.id, amount=15000, category="Salary", type="income", timestamp=datetime.datetime(2026, 7, 2)),
            models.Transaction(user_id=user.id, amount=1650, category="Food", type="expense", timestamp=datetime.datetime(2026, 6, 30)),
            models.Transaction(user_id=user.id, amount=1200, category="Transport", type="expense", timestamp=datetime.datetime(2026, 6, 28)),
            models.Transaction(user_id=user.id, amount=5400, category="Shopping", type="expense", timestamp=datetime.datetime(2026, 6, 25)),
            models.Transaction(user_id=user.id, amount=799, category="Others", type="expense", timestamp=datetime.datetime(2026, 6, 24)),
            models.Transaction(user_id=user.id, amount=2000, category="Others", type="expense", timestamp=datetime.datetime(2026, 6, 20))
        ]
        db.add_all(txs)

        # Create default goals
        goals = [
            models.FinancialGoal(user_id=user.id, name="Emergency Fund", target_amount=100000.0, current_amount=60000.0, target_date=datetime.date(2026, 12, 31)),
            models.FinancialGoal(user_id=user.id, name="Trip to Europe", target_amount=150000.0, current_amount=45000.0, target_date=datetime.date(2027, 5, 15)),
            models.FinancialGoal(user_id=user.id, name="New Car", target_amount=500000.0, current_amount=120000.0, target_date=datetime.date(2028, 6, 30))
        ]
        db.add_all(goals)

        # Create initial health score
        score = models.HealthScore(
            user_id=user.id,
            score=85,
            ai_insight_text="Your savings rate went up by 1.5%. You are in excellent financial shape!"
        )
        db.add(score)
        db.commit()

# Seed database on startup
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed_database(db)

# --- API ENDPOINTS ---

# Root check
@app.get("/")
def read_root():
    return {"message": "FinHealth API is running successfully.", "docs_url": "/docs"}

# USER profile
@app.get("/api/v1/user", response_model=schemas.UserResponse)
def get_user_profile(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# HEALTH SCORE: Dynamic evaluation based on transactions
@app.get("/api/v1/score", response_model=schemas.HealthScoreResponse)
def get_health_score(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()
    
    income = sum(t.amount for t in transactions if t.type == "income")
    expenses = sum(t.amount for t in transactions if t.type == "expense")
    
    if income == 0:
        calculated_score = 0
        insight = "Please log your income to calculate your Financial Health Score."
    else:
        savings_rate = ((income - expenses) / income) * 100
        debt_to_income_penalty = (expenses / income) * 50
        raw_score = 100 - debt_to_income_penalty + (savings_rate * 0.5)
        calculated_score = max(0, min(100, round(raw_score)))
        
        # Select appropriate insight based on score
        if calculated_score >= 80:
            insight = f"Excellent! Your calculated score is {calculated_score}/100. Your savings rate is strong at {savings_rate:.1f}%."
        elif calculated_score >= 50:
            insight = f"Stable. Your calculated score is {calculated_score}/100. We recommend optimizing food and shopping categories to increase savings."
        else:
            insight = f"Critical Warning! Your calculated score is {calculated_score}/100. Expenses are high relative to income. Suspend luxury budgets."

    new_score = models.HealthScore(
        user_id=user.id,
        score=calculated_score,
        ai_insight_text=insight
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    
    return new_score


# TRANSACTIONS ledger endpoints
@app.get("/api/v1/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(type: Optional[str] = None, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = db.query(models.Transaction).filter(models.Transaction.user_id == user.id)
    if type:
        query = query.filter(models.Transaction.type == type)
    
    return query.order_by(models.Transaction.timestamp.desc()).all()

@app.post("/api/v1/transactions", response_model=schemas.TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_tx = models.Transaction(
        user_id=user.id,
        amount=transaction.amount,
        category=transaction.category,
        type=transaction.type,
        timestamp=transaction.timestamp or datetime.datetime.utcnow()
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx


# FINANCIAL GOALS tracking endpoints
@app.get("/api/v1/goals", response_model=List[schemas.GoalResponse])
def get_goals(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return db.query(models.FinancialGoal).filter(models.FinancialGoal.user_id == user.id).all()

@app.post("/api/v1/goals", response_model=schemas.GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_goal = models.FinancialGoal(
        user_id=user.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.put("/api/v1/goals/{goal_id}/add-funds", response_model=schemas.GoalResponse)
def add_funds_to_goal(goal_id: int, amount: float, db: Session = Depends(get_db)):
    goal = db.query(models.FinancialGoal).filter(models.FinancialGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    goal.current_amount += amount
    db.commit()
    db.refresh(goal)
    return goal
