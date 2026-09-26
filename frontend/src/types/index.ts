export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'hr_admin' | 'viewer' | 'government';
  department?: string;
  is_active: boolean;
}

export interface DepartmentStatus {
  name: string;
  code: string;
  head_count: number;
  signals_count: number;
  review_signals_count: number;
  status: 'Normal' | 'Moderate' | 'Review';
  primary_signal?: string;
  workload_status: string;
  task_allocation_status: string;
  pay_status: string;
  promotion_status: string;
}

export interface NeedsReviewItem {
  id: number;
  department: string;
  metric: string;
  title: string;
  observed_difference: string;
  persistence: string;
  severity: 'review' | 'moderate' | 'normal';
  confidence: string;
  why_flagged: string;
  suggested_review: string;
}

export interface DashboardSummary {
  company_name: string;
  dataset_tag: string;
  total_employees: number;
  total_departments: number;
  active_signals_count: number;
  signals_requiring_review: number;
  needs_review_queue: NeedsReviewItem[];
  department_overview: DepartmentStatus[];
  quarterly_trends: Array<{
    quarter: string;
    total_signals: number;
    review_signals: number;
    sales_promo_gap: number;
    sales_task_gap: number;
  }>;
  last_updated: string;
}

export interface WorkloadAnalysis {
  department: string;
  period: string;
  overall_avg_hours: number;
  female_avg_hours: number;
  male_avg_hours: number;
  difference_hours: number;
  distribution_by_gender: Array<{
    bucket: string;
    female_count: number;
    male_count: number;
    female_pct: number;
    male_pct: number;
  }>;
  role_breakdown: Array<{
    role_title: string;
    female_count: number;
    male_count: number;
    female_avg_hours: number;
    male_avg_hours: number;
    delta_hours: number;
  }>;
  overtime_distribution: {
    female_overtime_count: number;
    male_overtime_count: number;
    female_overtime_pct: number;
    male_overtime_pct: number;
  };
  statistical_summary: {
    test_name?: string;
    sample_size_female?: number;
    sample_size_male?: number;
    p_value?: number;
    is_statistically_significant?: boolean;
    status?: string;
  };
  has_sufficient_data: boolean;
  signal_status: string;
}

export interface TaskAllocationAnalysis {
  department: string;
  period: string;
  categories: string[];
  female_distribution: Record<string, number>;
  male_distribution: Record<string, number>;
  differences_pp: Record<string, number>;
  category_breakdown_table: Array<{
    category: string;
    female_pct: number;
    male_pct: number;
    difference_pp: number;
    female_hours_total: number;
    male_hours_total: number;
  }>;
  high_visibility_share: {
    female_hivis_pct: number;
    male_hivis_pct: number;
    difference_pp: number;
  };
  comparable_role_analysis: Array<{
    role_title: string;
    sample_female: number;
    sample_male: number;
    female_admin_pct: number;
    male_admin_pct: number;
    difference_pp: number;
  }>;
  statistical_summary: {
    test_name?: string;
    sample_size_female?: number;
    sample_size_male?: number;
    p_value?: number;
    is_statistically_significant?: boolean;
  };
  has_sufficient_data: boolean;
  signal_status: string;
  largest_gap_category: string;
  largest_gap_pp: number;
}

export interface ComparablePayGroup {
  role_title: string;
  seniority_level: string;
  sample_female: number;
  sample_male: number;
  female_median_salary: number;
  male_median_salary: number;
  difference_pct: number;
  difference_abs: number;
  is_reliable_sample: boolean;
  statistical_significance?: string;
}

export interface PayAnalysis {
  department: string;
  period: string;
  raw_female_median: number;
  raw_male_median: number;
  raw_difference_pct: number;
  controlled_gap_pct: number;
  base_salary_gap_pct: number;
  bonus_gap_pct: number;
  increment_avg_female_pct: number;
  increment_avg_male_pct: number;
  comparable_groups: ComparablePayGroup[];
  salary_bands_distribution: Array<{
    band: string;
    female_count: number;
    male_count: number;
    female_share_pct: number;
    male_share_pct: number;
  }>;
  has_sufficient_data: boolean;
  is_gap_explained_by_controls: boolean;
  control_explanation: string;
  signal_status: string;
}

export interface PromotionQuarterTrend {
  quarter: string;
  female_rate_pct: number;
  male_rate_pct: number;
  gap_pp: number;
}

export interface PromotionAnalysis {
  department: string;
  period: string;
  overall_female_rate_pct: number;
  overall_male_rate_pct: number;
  gap_pp: number;
  quarters_trend: PromotionQuarterTrend[];
  trend_direction: 'Widening' | 'Narrowing' | 'Stable';
  progression_by_level: Array<{
    level_transition: string;
    female_promotions: number;
    male_promotions: number;
  }>;
  avg_tenure_before_promotion_female_months: number;
  avg_tenure_before_promotion_male_months: number;
  statistical_test: {
    test_name?: string;
    sample_size_female?: number;
    sample_size_male?: number;
    p_value?: number;
    is_statistically_significant?: boolean;
  };
  has_sufficient_data: boolean;
  persistence_quarters: number;
  signal_status: string;
}

export interface EquitySignal {
  id: number;
  department_name: string;
  metric: string;
  severity: 'review' | 'moderate' | 'normal';
  title: string;
  finding: string;
  explanation: string;
  why_flagged: string;
  suggested_review: string;
  hr_questions?: string[];
  observed_female_val?: number;
  observed_male_val?: number;
  difference_value: number;
  difference_unit: string;
  raw_difference?: number;
  controlled_difference?: number;
  persistence: string;
  quarters_persistent: number;
  confidence: 'high' | 'moderate' | 'low';
  sample_size: number;
  sample_size_female: number;
  sample_size_male: number;
  statistical_test?: string;
  p_value?: number;
  comparable_group_valid: boolean;
  control_variables?: string[];
  status: 'active' | 'investigating' | 'resolved' | 'acknowledged';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AIInsightResponse {
  finding: string;
  explanation: string;
  why_flagged: string;
  suggested_review: string;
  hr_questions: string[];
  investigation_steps: string[];
  confidence_assessment: string;
  grounding_data: Record<string, any>;
  source_model: string;
}

export interface AIChartExplainResponse {
  summary: string;
  key_observations: string[];
  contextual_caveats: string;
  hr_takeaway: string;
  source_model: string;
}

export interface AIChatResponse {
  response: string;
  cited_metrics: Array<{
    department: string;
    metric: string;
    value: string;
    source: string;
  }>;
  suggested_followups: string[];
  source_model: string;
}

export interface Report {
  id: number;
  title: string;
  department_name: string;
  report_type: string;
  period: string;
  summary: string;
  findings: any[];
  equity_signals: any[];
  recommended_actions: string[];
  investigation_questions: string[];
  author_email: string;
  created_at: string;
}

export interface BenchmarkValidationResult {
  test_cases_total: number;
  true_signals_injected: number;
  true_signals_detected: number;
  false_alerts_triggered: number;
  precision_pct: number;
  recall_pct: number;
  false_alert_rate_pct: number;
  statistical_consistency_score: number;
  test_breakdown: Array<{
    case_id: string;
    metric_type: string;
    sample_size: number;
    injected_effect: number;
    threshold_applied: number;
    ground_truth: string;
    detection_result: string;
    outcome: string;
  }>;
  evaluation_timestamp: string;
}

export interface GovernmentSectorMetric {
  sector_name: string;
  total_organisations: number;
  aggregated_headcount: number;
  active_signals_rate_pct: number;
  persistent_signals_count: number;
  avg_controlled_pay_gap_pct: number;
  task_allocation_signals: number;
  promotion_parity_index: number;
  sector_risk_status: string;
}

export interface GovernmentPreviewData {
  title: string;
  notice: string;
  sectors: GovernmentSectorMetric[];
  aggregated_trends: Array<Record<string, any>>;
  policy_recommendations: string[];
}
