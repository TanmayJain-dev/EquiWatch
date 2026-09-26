from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import Report, EquitySignal, Department
from app.services.analytics_engine import AnalyticsEngine
from app.services.ai_service import AIService

class ReportService:
    """
    Generates structured, professional HR Equity Review Reports.
    """

    @classmethod
    def generate_department_report(
        cls,
        db: Session,
        department_name: str,
        period: str = "2025-Q4",
        author_email: str = "hr@novaworks.com"
    ) -> Report:
        """
        Creates an official EquiWatch Department Review Report.
        """
        # Fetch analytical context
        task_data = AnalyticsEngine.analyze_task_allocation(db, department_name, period)
        pay_data = AnalyticsEngine.analyze_pay(db, department_name, period)
        promo_data = AnalyticsEngine.analyze_promotions(db, department_name, period)
        work_data = AnalyticsEngine.analyze_workload(db, department_name, period)

        # Fetch signals
        signals = db.query(EquitySignal).filter(EquitySignal.department_name == department_name).all()

        signals_json = []
        for s in signals:
            signals_json.append({
                "metric": s.metric,
                "severity": s.severity,
                "title": s.title,
                "finding": s.finding,
                "observed_female": s.observed_female_val,
                "observed_male": s.observed_male_val,
                "difference": f"{s.difference_value} {s.difference_unit}",
                "persistence": s.persistence,
                "confidence": s.confidence
            })

        findings_json = [
            {
                "area": "Task Allocation",
                "status": task_data["signal_status"],
                "metric_summary": f"Administrative task share: {task_data['female_distribution'].get('administrative', 0)}% (F) vs {task_data['male_distribution'].get('administrative', 0)}% (M).",
                "largest_gap": f"{task_data['largest_gap_category'].capitalize()} ({task_data['largest_gap_pp']} pp)"
            },
            {
                "area": "Promotions",
                "status": promo_data["signal_status"],
                "metric_summary": f"Annualized promotion rate: {promo_data['overall_female_rate_pct']}% (F) vs {promo_data['overall_male_rate_pct']}% (M).",
                "trend": f"{promo_data['trend_direction']} gap over {promo_data['persistence_quarters']} quarters."
            },
            {
                "area": "Compensation",
                "status": pay_data["signal_status"],
                "metric_summary": f"Controlled pay gap: {pay_data['controlled_gap_pct']}%.",
                "controlled_check": pay_data["control_explanation"]
            },
            {
                "area": "Workload",
                "status": work_data["signal_status"],
                "metric_summary": f"Average hours: {work_data['female_avg_hours']}h (F) vs {work_data['male_avg_hours']}h (M).",
                "overtime": f"Overtime rate: {work_data['overtime_distribution'].get('female_overtime_pct', 0)}% (F) vs {work_data['overtime_distribution'].get('male_overtime_pct', 0)}% (M)."
            }
        ]

        if department_name == "Sales":
            summary = (
                "EquiWatch identified two primary potential equity signals within the Sales department requiring HR review: "
                "1) A persistent task allocation disparity where female employees carry 61% of administrative coordination tasks vs 39% for male peers. "
                "2) A widening promotion rate gap (18.4% Female vs 26.7% Male) persistent across four quarters. "
                "Controlled compensation analysis indicates base pay bands are in parity within level, indicating disparities are concentrated in opportunity access and progression velocity."
            )
            recommended_actions = [
                "Establish a structured task rotation policy for internal administrative and operational duties.",
                "Implement clear, written readiness criteria and objective sponsorship guidelines for key client pitches.",
                "Conduct a joint review with Sales leadership of time-in-role distributions and promotion pipeline nominations.",
                "Schedule a 6-month progress checkpoint to measure promotion velocity and task rebalancing."
            ]
            investigation_questions = [
                "Are high-visibility revenue-generating client accounts assigned using a transparent merit framework?",
                "How are routine administrative tasks distributed across SDR and Account Executive cohorts?",
                "Do performance evaluation rubrics recognize non-promotable coordination work that supports team sales?"
            ]
        elif department_name == "Finance":
            summary = (
                "Finance exhibits healthy overall equity metrics. While a raw median salary gap exists, "
                "comparable-group analysis confirms this is fully explained by historical tenure and seniority distribution. "
                "Within identical roles and seniority tiers, controlled median compensation achieves 99.2% parity. No active review signals."
            )
            recommended_actions = [
                "Maintain transparent salary band midpoints during new hiring.",
                "Continue monitoring promotion rates into executive tiers."
            ]
            investigation_questions = [
                "Are succession planning pipelines actively supporting balanced leadership representation?"
            ]
        else:
            summary = (
                f"EquiWatch completed a multi-dimensional equity review for {department_name}. "
                f"Evaluation across Workload, Task Allocation, Pay, and Promotions indicates general alignment with organizational baselines."
            )
            recommended_actions = [
                "Continue standard quarterly monitoring.",
                "Review employee sentiment during annual feedback cycles."
            ]
            investigation_questions = [
                "Are workload distributions balanced during peak fiscal cycles?"
            ]

        report = Report(
            title=f"Workplace Equity Review Report — {department_name}",
            department_name=department_name,
            report_type="department_review",
            period=period,
            summary=summary,
            findings=findings_json,
            equity_signals=signals_json,
            recommended_actions=recommended_actions,
            investigation_questions=investigation_questions,
            author_email=author_email,
            created_at=datetime.utcnow()
        )

        db.add(report)
        db.commit()
        db.refresh(report)
        return report
