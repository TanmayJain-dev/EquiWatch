from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

# Dashboard summary
class DepartmentStatusItem(BaseModel):
    name: str
    code: str
    head_count: int
    signals_count: int
    review_signals_count: int
    status: str # Normal, Moderate, Review
    primary_signal: Optional[str] = None
    workload_status: str
    task_allocation_status: str
    pay_status: str
    promotion_status: str

class DashboardSummary(BaseModel):
    company_name: str
    dataset_tag: str
    total_employees: int
    total_departments: int
    active_signals_count: int
    signals_requiring_review: int
    needs_review_queue: List[Dict[str, Any]]
    department_overview: List[DepartmentStatusItem]
    quarterly_trends: List[Dict[str, Any]]
    last_updated: str

# Workload
class WorkloadAnalysis(BaseModel):
    department: str
    period: str
    overall_avg_hours: float
    female_avg_hours: float
    male_avg_hours: float
    difference_hours: float
    distribution_by_gender: List[Dict[str, Any]]
    role_breakdown: List[Dict[str, Any]]
    overtime_distribution: Dict[str, Any]
    statistical_summary: Dict[str, Any]
    has_sufficient_data: bool
    signal_status: str

# Task Allocation
class TaskAllocationAnalysis(BaseModel):
    department: str
    period: str
    categories: List[str]
    female_distribution: Dict[str, float]
    male_distribution: Dict[str, float]
    differences_pp: Dict[str, float]
    category_breakdown_table: List[Dict[str, Any]]
    high_visibility_share: Dict[str, float]
    comparable_role_analysis: List[Dict[str, Any]]
    statistical_summary: Dict[str, Any]
    has_sufficient_data: bool
    signal_status: str
    largest_gap_category: str
    largest_gap_pp: float

# Pay
class ComparablePayGroup(BaseModel):
    role_title: str
    seniority_level: str
    sample_female: int
    sample_male: int
    female_median_salary: float
    male_median_salary: float
    difference_pct: float
    difference_abs: float
    is_reliable_sample: bool
    statistical_significance: Optional[str] = None

class PayAnalysis(BaseModel):
    department: str
    period: str
    raw_female_median: float
    raw_male_median: float
    raw_difference_pct: float
    controlled_gap_pct: float
    base_salary_gap_pct: float
    bonus_gap_pct: float
    increment_avg_female_pct: float
    increment_avg_male_pct: float
    comparable_groups: List[ComparablePayGroup]
    salary_bands_distribution: List[Dict[str, Any]]
    has_sufficient_data: bool
    is_gap_explained_by_controls: bool
    control_explanation: str
    signal_status: str

# Promotions
class PromotionQuarterTrend(BaseModel):
    quarter: str
    female_rate_pct: float
    male_rate_pct: float
    gap_pp: float

class PromotionAnalysis(BaseModel):
    department: str
    period: str
    overall_female_rate_pct: float
    overall_male_rate_pct: float
    gap_pp: float
    quarters_trend: List[PromotionQuarterTrend]
    trend_direction: str # Widening, Narrowing, Stable
    progression_by_level: List[Dict[str, Any]]
    avg_tenure_before_promotion_female_months: float
    avg_tenure_before_promotion_male_months: float
    statistical_test: Dict[str, Any]
    has_sufficient_data: bool
    persistence_quarters: int
    signal_status: str

# Signals
class EquitySignalOut(BaseModel):
    id: int
    department_name: str
    metric: str
    severity: str
    title: str
    finding: str
    explanation: str
    why_flagged: str
    suggested_review: str
    hr_questions: Optional[List[str]] = None
    observed_female_val: Optional[float] = None
    observed_male_val: Optional[float] = None
    difference_value: float
    difference_unit: str
    raw_difference: Optional[float] = None
    controlled_difference: Optional[float] = None
    persistence: str
    quarters_persistent: int
    confidence: str
    sample_size: int
    sample_size_female: int
    sample_size_male: int
    statistical_test: Optional[str] = None
    p_value: Optional[float] = None
    comparable_group_valid: bool
    control_variables: Optional[List[str]] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# AI requests & responses
class AIInsightRequest(BaseModel):
    department: str
    metric: str
    signal_id: Optional[int] = None
    context_data: Optional[Dict[str, Any]] = None

class AIInsightResponse(BaseModel):
    finding: str
    explanation: str
    why_flagged: str
    suggested_review: str
    hr_questions: List[str]
    investigation_steps: List[str]
    confidence_assessment: str
    grounding_data: Dict[str, Any]
    source_model: str

class AIChartExplainRequest(BaseModel):
    chart_title: str
    metric: str
    department: str
    data_points: List[Dict[str, Any]]
    chart_context: Optional[str] = None

class AIChartExplainResponse(BaseModel):
    summary: str
    key_observations: List[str]
    contextual_caveats: str
    hr_takeaway: str
    source_model: str

class AIChatMessage(BaseModel):
    role: str # user, assistant
    content: str
    timestamp: Optional[str] = None

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[AIChatMessage]] = []
    department_filter: Optional[str] = None

class AIChatResponse(BaseModel):
    response: str
    cited_metrics: List[Dict[str, Any]]
    suggested_followups: List[str]
    source_model: str

# Reports
class ReportCreate(BaseModel):
    department_name: str
    period: str
    title: Optional[str] = None

class ReportOut(BaseModel):
    id: int
    title: str
    department_name: str
    report_type: str
    period: str
    summary: str
    findings: List[Dict[str, Any]]
    equity_signals: List[Dict[str, Any]]
    recommended_actions: List[str]
    investigation_questions: List[str]
    author_email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Data & CSV Upload
class CSVUploadResult(BaseModel):
    success: bool
    rows_processed: int
    employees_created: int
    task_records_created: int
    compensation_records_created: int
    promotions_created: int
    validation_errors: List[str]
    warnings: List[str]
    message: str

# Government Preview
class GovernmentSectorMetric(BaseModel):
    sector_name: str
    total_organisations: int
    aggregated_headcount: int
    active_signals_rate_pct: float
    persistent_signals_count: int
    avg_controlled_pay_gap_pct: float
    task_allocation_signals: int
    promotion_parity_index: float # 1.0 = parity
    sector_risk_status: str # Low, Moderate, Review

class GovernmentPreviewData(BaseModel):
    title: str
    notice: str
    sectors: List[GovernmentSectorMetric]
    aggregated_trends: List[Dict[str, Any]]
    policy_recommendations: List[str]

# Benchmark Validation
class BenchmarkValidationResult(BaseModel):
    test_cases_total: int
    true_signals_injected: int
    true_signals_detected: int
    false_alerts_triggered: int
    precision_pct: float
    recall_pct: float
    false_alert_rate_pct: float
    statistical_consistency_score: float
    test_breakdown: List[Dict[str, Any]]
    evaluation_timestamp: str
