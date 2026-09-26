from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Department, EquitySignal, Employee
from app.services.analytics_engine import AnalyticsEngine

router = APIRouter()

@router.get("")
def list_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    results = []
    for d in departments:
        signals = db.query(EquitySignal).filter(EquitySignal.department_name == d.name, EquitySignal.status == "active").all()
        review_count = sum(1 for s in signals if s.severity == "review")
        status = "Review" if review_count > 0 else ("Moderate" if any(s.severity == "moderate" for s in signals) else "Normal")
        
        results.append({
            "id": d.id,
            "name": d.name,
            "code": d.code,
            "description": d.description,
            "head_count": d.head_count,
            "status": status,
            "signals_count": len(signals),
            "review_signals_count": review_count
        })
    return results

@router.get("/{name}/overview")
def get_department_overview(name: str, period: str = "2025-Q4", db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.name.ilike(name)).first()
    if not dept:
        raise HTTPException(status_code=404, detail=f"Department '{name}' not found.")

    signals = db.query(EquitySignal).filter(EquitySignal.department_name == dept.name).all()
    
    # Run all 4 analytics modules
    work_res = AnalyticsEngine.analyze_workload(db, dept.name, period)
    task_res = AnalyticsEngine.analyze_task_allocation(db, dept.name, period)
    pay_res = AnalyticsEngine.analyze_pay(db, dept.name, period)
    promo_res = AnalyticsEngine.analyze_promotions(db, dept.name, period)

    review_signals = [s for s in signals if s.severity == "review" and s.status == "active"]
    status = "Review" if review_signals else ("Moderate" if any(s.severity == "moderate" for s in signals) else "Normal")

    return {
        "department": {
            "id": dept.id,
            "name": dept.name,
            "code": dept.code,
            "description": dept.description,
            "head_count": dept.head_count,
            "status": status,
        },
        "signals": [
            {
                "id": s.id,
                "metric": s.metric,
                "severity": s.severity,
                "title": s.title,
                "finding": s.finding,
                "explanation": s.explanation,
                "why_flagged": s.why_flagged,
                "suggested_review": s.suggested_review,
                "difference_value": s.difference_value,
                "difference_unit": s.difference_unit,
                "persistence": s.persistence,
                "confidence": s.confidence,
                "p_value": s.p_value,
                "status": s.status
            }
            for s in signals
        ],
        "pillar_summary": {
            "workload": {
                "status": work_res["signal_status"],
                "female_avg_hours": work_res["female_avg_hours"],
                "male_avg_hours": work_res["male_avg_hours"],
                "difference_hours": work_res["difference_hours"]
            },
            "task_allocation": {
                "status": task_res["signal_status"],
                "largest_gap_category": task_res["largest_gap_category"],
                "largest_gap_pp": task_res["largest_gap_pp"],
                "administrative_female_pct": task_res["female_distribution"].get("administrative", 0),
                "administrative_male_pct": task_res["male_distribution"].get("administrative", 0)
            },
            "pay": {
                "status": pay_res["signal_status"],
                "raw_gap_pct": pay_res["raw_difference_pct"],
                "controlled_gap_pct": pay_res["controlled_gap_pct"],
                "is_explained_by_controls": pay_res["is_gap_explained_by_controls"],
                "explanation": pay_res["control_explanation"]
            },
            "promotions": {
                "status": promo_res["signal_status"],
                "female_rate_pct": promo_res["overall_female_rate_pct"],
                "male_rate_pct": promo_res["overall_male_rate_pct"],
                "gap_pp": promo_res["gap_pp"],
                "trend_direction": promo_res["trend_direction"],
                "persistence_quarters": promo_res["persistence_quarters"]
            }
        }
    }
