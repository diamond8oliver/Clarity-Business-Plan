"""ClarityRx backend blueprint.

This module defines:
- SQLAlchemy ORM models for the core ClarityRx data model (PostgreSQL-oriented)
- FastAPI endpoints for onboarding, dosing logs, history/diary, stats, and AI chat
- Personalization and history query helpers (skeletons)

It is designed as a concrete starting point for implementation, not a full app.
"""

from __future__ import annotations

from datetime import datetime, timedelta, date
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    BigInteger,
    String,
    Text,
    Date,
    DateTime,
    Boolean,
    Numeric,
    ForeignKey,
    Enum,
    ARRAY,
    func,
)
from sqlalchemy.orm import declarative_base, relationship, Session, sessionmaker


# ---------------------------------------------------------------------------
# Database setup (adjust DATABASE_URL as needed)
# ---------------------------------------------------------------------------

DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/clarityrx"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

Base = declarative_base()


# ---------------------------------------------------------------------------
# ORM models (subset focused on core flows + diary fields)
# ---------------------------------------------------------------------------


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True))

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    dosing_events = relationship("DosingEvent", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    state = Column(String)  # 'CA'
    cannabis_experience = Column(String)  # naive, light, regular, heavy
    primary_goals = Column(ARRAY(String))  # ['sleep','anxiety']

    user = relationship("User", back_populates="profile")


class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True)
    sku = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    thc_mg_per_capsule = Column(Numeric(5, 2), nullable=False)
    intended_effect = Column(String, nullable=False)  # sleep, calm, relief, focus
    persona = Column(String)
    description = Column(Text)
    is_active = Column(Boolean, nullable=False, server_default="true")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dosing_events = relationship("DosingEvent", back_populates="product")


class DosingEvent(Base):
    __tablename__ = "dosing_events"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)
    capsules_taken = Column(Integer, nullable=False)
    total_dose_mg_thc = Column(Numeric(6, 2), nullable=False)
    taken_at = Column(DateTime(timezone=True), nullable=False)
    with_food = Column(Boolean)
    with_alcohol = Column(Boolean)
    time_of_day = Column(String)  # morning, afternoon, evening, night
    context_notes = Column(Text)

    # Quick rating system additions
    quick_rating = Column(Integer)  # 1-5 stars
    thumbs = Column(String)  # 'up', 'down', or NULL
    tags = Column(ARRAY(String))  # ['helped sleep','felt groggy']

    user = relationship("User", back_populates="dosing_events")
    product = relationship("Product", back_populates="dosing_events")
    outcome = relationship("DosingOutcome", back_populates="dosing_event", uselist=False)


class DosingOutcome(Base):
    __tablename__ = "dosing_outcomes"

    id = Column(BigInteger, primary_key=True)
    dosing_event_id = Column(BigInteger, ForeignKey("dosing_events.id", ondelete="CASCADE"), unique=True)
    desired_outcome = Column(String)  # sleep, calm, relief, focus
    outcome_score = Column(Integer)  # 1-10
    side_effect_score = Column(Integer)  # 0-10
    side_effect_notes = Column(Text)
    logged_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dosing_event = relationship("DosingEvent", back_populates="outcome")


class UserReview(Base):
    __tablename__ = "user_reviews"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    effect_accuracy = Column(Integer)
    side_effect_severity = Column(Integer)
    would_recommend = Column(Boolean)
    primary_goal = Column(String)
    age_bucket = Column(String)
    experience_level = Column(String)
    review_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    session_id = Column(String, nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    topic = Column(String)
    flagged_for_review = Column(Boolean, nullable=False, server_default="false")
    safety_label = Column(String)


class UserStats(Base):
    """Optional materialized view/table for dashboard metrics.

    For simplicity, define as a table here. In production you may want a
    materialized view refreshed periodically.
    """

    __tablename__ = "user_stats"

    user_id = Column(BigInteger, primary_key=True)
    total_doses = Column(Integer, nullable=False, default=0)
    favorite_product_id = Column(BigInteger)
    favorite_product_rating = Column(Numeric(3, 2))
    avg_rating_all = Column(Numeric(3, 2))
    longest_streak_days = Column(Integer)


# ---------------------------------------------------------------------------
# FastAPI app and dependency
# ---------------------------------------------------------------------------

app = FastAPI(title="ClarityRx Backend")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class OnboardingRequest(BaseModel):
    email: str
    password: str
    first_name: Optional[str]
    last_name: Optional[str]
    date_of_birth: date
    gender: Optional[str]
    state: str = "CA"
    cannabis_experience: str
    primary_goals: List[str]


class OnboardingResponse(BaseModel):
    user_id: int
    suggested_product_sku: str
    suggested_thc_mg: float
    explanation: str


class DosingLogRequest(BaseModel):
    user_id: int
    product_sku: str
    capsules_taken: int
    taken_at: datetime
    with_food: bool = False
    with_alcohol: bool = False
    time_of_day: str
    outcome_score: Optional[int] = None
    desired_outcome: Optional[str] = None
    side_effect_score: Optional[int] = None
    side_effect_notes: Optional[str] = None
    quick_rating: Optional[int] = None
    thumbs: Optional[str] = None  # 'up' or 'down'
    tags: Optional[List[str]] = None


class ChatRequest(BaseModel):
    user_id: int
    session_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str


class HistoryFilter(BaseModel):
    user_id: int
    product_sku: Optional[str] = None
    min_rating: Optional[int] = None
    max_rating: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    desired_outcome: Optional[str] = None


class HistoryEntry(BaseModel):
    dosing_event_id: int
    date: date
    product_name: str
    product_sku: str
    quick_rating: Optional[int]
    thumbs: Optional[str]
    tags: List[str]
    desired_outcome: Optional[str]
    outcome_score: Optional[int]
    time_of_day: Optional[str]


class HistoryResponse(BaseModel):
    entries: List[HistoryEntry]


# ---------------------------------------------------------------------------
# Helper: simple onboarding & starter product selection
# ---------------------------------------------------------------------------


def select_starter_product(db: Session, profile: UserProfile) -> Product:
    """Very simple rule-based starter product selection.

    - If sleep is a primary goal and user is 60+ and naive -> Deep Rest Micro (2.5 mg)
    - Else if sleep and experience != naive -> Deep Rest (5 mg)
    - Else if calm -> Calm Clarity
    - Else if focus -> Focus Crisp
    - Fallback: Calm Clarity.
    """

    # In a real app, age would be computed; here we approximate.
    age = None
    if profile.date_of_birth:
        today = date.today()
        age = today.year - profile.date_of_birth.year - (
            (today.month, today.day) < (profile.date_of_birth.month, profile.date_of_birth.day)
        )

    goals = profile.primary_goals or []
    exp = (profile.cannabis_experience or "naive").lower()

    def get_product_by_sku(sku: str) -> Product:
        prod = db.query(Product).filter(Product.sku == sku).first()
        if not prod:
            raise HTTPException(status_code=500, detail=f"Product with SKU {sku} not found")
        return prod

    if "sleep" in goals:
        if age is not None and age >= 60 and exp == "naive":
            return get_product_by_sku("CRX-DR-2.5")
        return get_product_by_sku("CRX-DR-5")

    if "anxiety" in goals or "calm" in goals:
        return get_product_by_sku("CRX-CL-2.5")

    if "focus" in goals:
        return get_product_by_sku("CRX-FC-2.5")

    return get_product_by_sku("CRX-CL-2.5")


# ---------------------------------------------------------------------------
# Personalization & history helpers
# ---------------------------------------------------------------------------


def build_history_query(db: Session, flt: HistoryFilter):
    q = (
        db.query(
            DosingEvent.id.label("dosing_event_id"),
            DosingEvent.taken_at,
            DosingEvent.quick_rating,
            DosingEvent.thumbs,
            DosingEvent.tags,
            DosingEvent.time_of_day,
            Product.name.label("product_name"),
            Product.sku.label("product_sku"),
            DosingOutcome.desired_outcome,
            DosingOutcome.outcome_score,
        )
        .join(Product, DosingEvent.product_id == Product.id)
        .outerjoin(DosingOutcome, DosingOutcome.dosing_event_id == DosingEvent.id)
        .filter(DosingEvent.user_id == flt.user_id)
    )

    if flt.product_sku:
        q = q.filter(Product.sku == flt.product_sku)
    if flt.min_rating is not None:
        q = q.filter(DosingEvent.quick_rating >= flt.min_rating)
    if flt.max_rating is not None:
        q = q.filter(DosingEvent.quick_rating <= flt.max_rating)
    if flt.start_date:
        q = q.filter(DosingEvent.taken_at >= datetime.combine(flt.start_date, datetime.min.time()))
    if flt.end_date:
        q = q.filter(DosingEvent.taken_at <= datetime.combine(flt.end_date, datetime.max.time()))
    if flt.desired_outcome:
        q = q.filter(DosingOutcome.desired_outcome == flt.desired_outcome)

    return q.order_by(DosingEvent.taken_at.desc())


# ---------------------------------------------------------------------------
# API endpoints
# ---------------------------------------------------------------------------


@app.post("/onboarding", response_model=OnboardingResponse)
def onboarding(req: OnboardingRequest, db: Session = Depends(get_db)):
    user = User(email=req.email, password_hash="TODO:hash")
    db.add(user)
    db.flush()  # get user.id

    profile = UserProfile(
        user_id=user.id,
        first_name=req.first_name,
        last_name=req.last_name,
        date_of_birth=req.date_of_birth,
        gender=req.gender,
        state=req.state,
        cannabis_experience=req.cannabis_experience,
        primary_goals=req.primary_goals,
    )
    db.add(profile)

    # Choose starter product
    product = select_starter_product(db, profile)

    db.commit()

    explanation = (
        f"Based on your age, experience level, and goals, we're starting you with {product.name} "
        f"({product.thc_mg_per_capsule} mg THC)."
    )

    return OnboardingResponse(
        user_id=user.id,
        suggested_product_sku=product.sku,
        suggested_thc_mg=float(product.thc_mg_per_capsule),
        explanation=explanation,
    )


@app.post("/dosing-events")
def log_dosing_event(req: DosingLogRequest, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.sku == req.product_sku).first()
    if not product:
        raise HTTPException(status_code=400, detail="Unknown product SKU")

    ev = DosingEvent(
        user_id=req.user_id,
        product_id=product.id,
        capsules_taken=req.capsules_taken,
        total_dose_mg_thc=product.thc_mg_per_capsule * req.capsules_taken,
        taken_at=req.taken_at,
        with_food=req.with_food,
        with_alcohol=req.with_alcohol,
        time_of_day=req.time_of_day,
        quick_rating=req.quick_rating,
        thumbs=req.thumbs,
        tags=req.tags or [],
    )
    db.add(ev)
    db.flush()

    if req.outcome_score is not None:
        outcome = DosingOutcome(
            dosing_event_id=ev.id,
            desired_outcome=req.desired_outcome,
            outcome_score=req.outcome_score,
            side_effect_score=req.side_effect_score,
            side_effect_notes=req.side_effect_notes,
        )
        db.add(outcome)

    db.commit()
    return {"status": "ok", "dosing_event_id": ev.id}


@app.post("/history", response_model=HistoryResponse)
def get_history(flt: HistoryFilter, db: Session = Depends(get_db)):
    q = build_history_query(db, flt)
    rows = q.all()

    entries: List[HistoryEntry] = []
    for r in rows:
        entries.append(
            HistoryEntry(
                dosing_event_id=r.dosing_event_id,
                date=r.taken_at.date(),
                product_name=r.product_name,
                product_sku=r.product_sku,
                quick_rating=r.quick_rating,
                thumbs=r.thumbs,
                tags=r.tags or [],
                desired_outcome=r.desired_outcome,
                outcome_score=r.outcome_score,
                time_of_day=r.time_of_day,
            )
        )

    return HistoryResponse(entries=entries)


@app.post("/ai/chat", response_model=ChatResponse)
def ai_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """Placeholder AI chat endpoint.

    In production this would:
    - Load user profile + recent dosing summary
    - Retrieve relevant educational content
    - Build a safety-focused prompt
    - Call an LLM provider
    - Log the conversation to chat_logs
    """

    # For now, echo with a safe message.
    reply = (
        "I'm a prototype ClarityRx assistant. I can help explain how products differ and how "
        "people generally use them, but I can't give medical advice. Please talk to your doctor "
        "for questions about specific medications or conditions."
    )

    log = ChatLog(
        user_id=req.user_id,
        session_id=req.session_id,
        role="assistant",
        message=reply,
    )
    db.add(log)
    db.commit()

    return ChatResponse(reply=reply)


# Note: you would also add endpoints for stats dashboards and review submission,
# but those are omitted here for brevity.


def init_db():  # pragma: no cover - helper for local setup
    """Create tables in the configured database.

    Run this once in a dev environment after configuring DATABASE_URL.
    """

    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":  # pragma: no cover
    # Simple manual smoke test for metadata creation
    init_db()
    print("Database schema created (if not already present).")
