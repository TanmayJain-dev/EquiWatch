from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.analytics_engine import AnalyticsEngine
from app.schemas.schemas import WorkloadAnalysis, TaskAllocationAnalysis, PayAnalysis, PromotionAnalysis

router = APIRouter()

@router.get("/workload", response_model=WorkloadAnalysis)
def get_workload_analysis(
    department: str = Query(default="Sales"),
    period: str = Query(default="2025-Q4"),
    db: Session = Depends(get_db)
):
    return AnalyticsEngine.analyze_workload(db, department_name=department, period=period)

@router.get("/tasks", response_model=TaskAllocationAnalysis)
def get_task_analysis(
    department: str = Query(default="Sales"),
    period: str = Query(default="2025-Q4"),
    db: Session = Depends(get_db)
):
    return AnalyticsEngine.analyze_task_allocation(db, department_name=department, period=period)

@router.get("/pay", response_model=PayAnalysis)
def get_pay_analysis(
    department: str = Query(default="Sales"),
    period: str = Query(default="2025-Q4"),
    db: Session = Depends(get_db)
):
    return AnalyticsEngine.analyze_pay(db, department_name=department, period=period)

@router.get("/promotions", response_model=PromotionAnalysis)
def get_promotion_analysis(
    department: str = Query(default="Sales"),
    period: str = Query(default="2025-Q4"),
    db: Session = Depends(get_db)
):
    return AnalyticsEngine.analyze_promotions(db, department_name=department, period=period)

@router.get("/trends")
def get_multi_department_trends(db: Session = Depends(get_db)):
    """
    Returns comparative trends across all 5 departments for the past 8 quarters.
    """
    quarters = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"]
    departments = ["Sales", "Operations", "Finance", "IT", "HR"]

    trends = []
    for q in quarters:
        row = {"quarter": q}
        for dept in departments:
            p_res = AnalyticsEngine.analyze_promotions(db, dept, q)
            t_res = AnalyticsEngine.analyze_task_allocation(db, dept, q)
            row[f"{dept.lower()}_promo_gap"] = p_res["gap_pp"]
            row[f"{dept.lower()}_admin_gap"] = t_res["differences_pp"].get("administrative", 0.0)
        trends.append(row)

    return {"periods": quarters, "trends": trends}
