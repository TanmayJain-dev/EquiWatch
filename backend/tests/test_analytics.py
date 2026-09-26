import pytest
from app.core.database import SessionLocal
from app.models.models import Department, Employee, TaskRecord, Compensation, CareerEvent
from app.services.synthetic_data import generate_synthetic_dataset
from app.services.analytics_engine import AnalyticsEngine
from app.services.signal_detector import SignalDetector
from app.services.validation_service import ValidationService

@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

def test_synthetic_data_generation(db_session):
    emp_count = db_session.query(Employee).count()
    dept_count = db_session.query(Department).count()
    assert emp_count >= 1000, "Should generate at least 1000 synthetic employees"
    assert dept_count == 5, "Should have 5 departments"

def test_sales_task_allocation_disparity(db_session):
    task_res = AnalyticsEngine.analyze_task_allocation(db_session, "Sales", "2025-Q4")
    assert task_res["has_sufficient_data"] is True
    assert task_res["signal_status"] in ["review", "moderate"]
    admin_f = task_res["female_distribution"]["administrative"]
    admin_m = task_res["male_distribution"]["administrative"]
    assert admin_f > admin_m, "Female employees in Sales should have higher administrative workload share"

def test_sales_promotion_disparity(db_session):
    promo_res = AnalyticsEngine.analyze_promotions(db_session, "Sales", "2025-Q4")
    assert promo_res["has_sufficient_data"] is True
    assert promo_res["gap_pp"] >= 5.0, "Sales promotion gap should be at least 5 pp"
    assert promo_res["persistence_quarters"] >= 4, "Sales promotion gap should be persistent across at least 4 quarters"

def test_finance_pay_controls(db_session):
    pay_res = AnalyticsEngine.analyze_pay(db_session, "Finance", "2025-Q4")
    assert pay_res["has_sufficient_data"] is True
    # Controlled gap should show parity
    assert abs(pay_res["controlled_gap_pct"]) < 3.5, "Controlled pay gap in Finance should show parity"

def test_signal_detection_engine(db_session):
    signals = SignalDetector.evaluate_all_departments(db_session, "2025-Q4")
    assert len(signals) > 0, "Signal detector should identify active signals"
    sales_signals = [s for s in signals if s.department_name == "Sales"]
    assert len(sales_signals) >= 1, "Sales should have at least 1 review signal"

def test_benchmark_validation_metrics():
    res = ValidationService.run_benchmark_validation(num_test_cases=50)
    assert res["test_cases_total"] == 50
    assert 0 <= res["precision_pct"] <= 100
    assert 0 <= res["recall_pct"] <= 100
    assert res["statistical_consistency_score"] > 0.70
