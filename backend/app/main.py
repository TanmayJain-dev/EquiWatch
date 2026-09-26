from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.models import User, Department, Employee
from app.services.synthetic_data import generate_synthetic_dataset
from app.services.signal_detector import SignalDetector
from app.api.v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial demo dataset if database is empty
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        emp_count = db.query(Employee).count()
        if user_count == 0 or emp_count == 0:
            print("Seeding initial NovaWorks synthetic dataset...")
            generate_synthetic_dataset(db, force_reset=True)
            SignalDetector.evaluate_all_departments(db, period="2025-Q4")
            print("Seeding complete. EquiWatch is demo-ready.")
    finally:
        db.close()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="EquiWatch: Detect. Explain. Act. — AI-powered workplace gender-equity decision-support system.",
    lifespan=lifespan
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EquiWatch Backend API",
        "version": settings.VERSION,
        "engine": "Decision-Support Analytics v1.0"
    }
