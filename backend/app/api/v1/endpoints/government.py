from fastapi import APIRouter
from app.schemas.schemas import GovernmentPreviewData, GovernmentSectorMetric

router = APIRouter()

@router.get("/preview", response_model=GovernmentPreviewData)
def get_government_preview():
    """
    Returns aggregated, anonymized industry sector benchmarks for regulatory/policy oversight.
    Zero individual employee records or PII are exposed in this layer.
    """
    sectors = [
        GovernmentSectorMetric(
            sector_name="Information Technology & SaaS",
            total_organisations=142,
            aggregated_headcount=48500,
            active_signals_rate_pct=18.4,
            persistent_signals_count=14,
            avg_controlled_pay_gap_pct=3.1,
            task_allocation_signals=28,
            promotion_parity_index=0.88,
            sector_risk_status="Moderate"
        ),
        GovernmentSectorMetric(
            sector_name="Banking, Financial Services & Insurance",
            total_organisations=88,
            aggregated_headcount=62000,
            active_signals_rate_pct=14.2,
            persistent_signals_count=9,
            avg_controlled_pay_gap_pct=2.4,
            task_allocation_signals=12,
            promotion_parity_index=0.94,
            sector_risk_status="Low"
        ),
        GovernmentSectorMetric(
            sector_name="Manufacturing & Industrial Operations",
            total_organisations=110,
            aggregated_headcount=89000,
            active_signals_rate_pct=24.8,
            persistent_signals_count=17,
            avg_controlled_pay_gap_pct=5.6,
            task_allocation_signals=34,
            promotion_parity_index=0.79,
            sector_risk_status="Review"
        ),
        GovernmentSectorMetric(
            sector_name="Public Administration & Healthcare",
            total_organisations=76,
            aggregated_headcount=51200,
            active_signals_rate_pct=16.0,
            persistent_signals_count=11,
            avg_controlled_pay_gap_pct=1.8,
            task_allocation_signals=19,
            promotion_parity_index=0.92,
            sector_risk_status="Moderate"
        )
    ]

    aggregated_trends = [
        {"year": "2022", "it_risk": 22.0, "bfsi_risk": 18.0, "mfg_risk": 29.0},
        {"year": "2023", "it_risk": 20.4, "bfsi_risk": 16.2, "mfg_risk": 27.5},
        {"year": "2024", "it_risk": 18.9, "bfsi_risk": 15.0, "mfg_risk": 26.0},
        {"year": "2025", "it_risk": 18.4, "bfsi_risk": 14.2, "mfg_risk": 24.8},
    ]

    policy_recs = [
        "Incentivize periodic transparency reporting for non-promotable operational workload distribution.",
        "Encourage standardized calibration audits in enterprise sales and promotion tracks.",
        "Provide grant credits for organizations implementing transparent compensation band midpoints."
    ]

    return GovernmentPreviewData(
        title="Government Equity Monitor",
        notice="Future Scope — Demonstration Concept (Anonymized Sector-Level Aggregates Only)",
        sectors=sectors,
        aggregated_trends=aggregated_trends,
        policy_recommendations=policy_recs
    )
