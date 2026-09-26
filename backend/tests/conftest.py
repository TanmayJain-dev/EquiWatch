import pytest
from app.core.database import engine, Base, SessionLocal
from app.services.synthetic_data import generate_synthetic_dataset
from app.services.signal_detector import SignalDetector

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        generate_synthetic_dataset(db, force_reset=True)
        SignalDetector.evaluate_all_departments(db, period="2025-Q4")
    finally:
        db.close()
    yield
