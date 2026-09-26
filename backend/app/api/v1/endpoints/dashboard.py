from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Department, Employee, EquitySignal
from app.schemas.schemas import DashboardSummary, DepartmentStatusItem
from app.api.deps import get_current_user
from app.services.analytics_engine import AnalyticsEngine

router = APIRouter()

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_emp = db.query(Employee).count()
    departments = db.query(Department).all()
    signals = db.query(EquitySignal).all()

    active_signals = [s for s in signals if s.status == "active"]
    review_signals = [s for s in active_signals if s.severity == "review"]

    dept_overview = []
    for d in departments:
        d_signals = [s for s in active_signals if s.department_name == d.name]
        d_review = [s for s in d_signals if s.severity == "review"]
        
        # Calculate pillar statuses
        work_res = AnalyticsEngine.analyze_workload(db, d.name)
        task_res = AnalyticsEngine.analyze_task_allocation(db, d.name)
        pay_res = AnalyticsEngine.analyze_pay(db, d.name)
        promo_res = AnalyticsEngine.analyze_promotions(db, d.name)

        if len(d_review) > 0:
            status = "Review"
        elif any(s.severity == "moderate" for s in d_signals):
            status = "Moderate"
        else:
            status = "Normal"

        primary_sig = d_signals[0].title if d_signals else "No active disparities"

        dept_overview.append(
            DepartmentStatusItem(
                name=d.name,
                code=d.code,
                head_count=d.head_count,
                signals_count=len(d_signals),
                review_signals_count=len(d_review),
                status=status,
                primary_signal=primary_sig,
                workload_status=work_res["signal_status"].capitalize(),
                task_allocation_status=task_res["signal_status"].capitalize(),
                pay_status=pay_res["signal_status"].capitalize(),
                promotion_status=promo_res["signal_status"].capitalize()
            )
        )

    # Prioritized Needs Review queue (Section 28)
    needs_review_queue = []
    for s in review_signals:
        needs_review_queue.append({
            "id": s.id,
            "department": s.department_name,
            "metric": s.metric,
            "title": s.title,
            "observed_difference": f"{s.difference_value} {s.difference_unit}",
            "persistence": s.persistence,
            "severity": s.severity,
            "confidence": s.confidence,
            "why_flagged": s.why_flagged,
            "suggested_review": s.suggested_review
        })

    # Quarterly trends
    quarterly_trends = [
        {"quarter": "2024-Q1", "total_signals": 1, "review_signals": 1, "sales_promo_gap": 3.2, "sales_task_gap": 18.0},
        {"quarter": "2024-Q2", "total_signals": 2, "review_signals": 1, "sales_promo_gap": 4.8, "sales_task_gap": 19.5},
        {"quarter": "2024-Q3", "total_signals": 2, "review_signals": 2, "sales_promo_gap": 7.1, "sales_task_gap": 21.0},
        {"quarter": "2024-Q4", "total_signals": 3, "review_signals": 2, "sales_promo_gap": 8.3, "sales_task_gap": 22.0},
        {"quarter": "2025-Q1", "total_signals": 3, "review_signals": 2, "sales_promo_gap": 8.1, "sales_task_gap": 22.2},
        {"quarter": "2025-Q2", "total_signals": 3, "review_signals": 2, "sales_promo_gap": 8.4, "sales_task_gap": 21.8},
        {"quarter": "2025-Q3", "total_signals": 3, "review_signals": 2, "sales_promo_gap": 8.2, "sales_task_gap": 22.1},
        {"quarter": "2025-Q4", "total_signals": len(active_signals), "review_signals": len(review_signals), "sales_promo_gap": 8.3, "sales_task_gap": 22.0},
    ]

    return DashboardSummary(
        company_name="NovaWorks",
        dataset_tag="Demo dataset — synthetic workforce dataset",
        total_employees=total_emp,
        total_departments=len(departments),
        active_signals_count=len(active_signals),
        signals_requiring_review=len(review_signals),
        needs_review_queue=needs_review_queue,
        department_overview=dept_overview,
        quarterly_trends=quarterly_trends,
        last_updated=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    )
