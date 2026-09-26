import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2, Users, ArrowLeft, FileText, Sparkles, AlertTriangle,
  CheckCircle2, Clock, CheckSquare, DollarSign, TrendingUp, HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { SignalBadge, ConfidenceBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { DecisionActionDrawer } from '../components/ui/DecisionActionDrawer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  WorkloadAnalysis, TaskAllocationAnalysis, PayAnalysis, PromotionAnalysis, EquitySignal
} from '../types';

export const DepartmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const departmentName = id || 'Sales';

  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'tasks' | 'pay' | 'promotions'>('overview');
  const [deptOverview, setDeptOverview] = useState<any>(null);
  const [workloadData, setWorkloadData] = useState<WorkloadAnalysis | null>(null);
  const [taskData, setTaskData] = useState<TaskAllocationAnalysis | null>(null);
  const [payData, setPayData] = useState<PayAnalysis | null>(null);
  const [promotionData, setPromotionData] = useState<PromotionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSignal, setSelectedSignal] = useState<EquitySignal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadAllDepartmentData();
  }, [departmentName]);

  const loadAllDepartmentData = async () => {
    setLoading(true);
    try {
      const [overview, work, tasks, pay, promo] = await Promise.all([
        api.getDepartmentOverview(departmentName),
        api.getWorkload(departmentName),
        api.getTasks(departmentName),
        api.getPay(departmentName),
        api.getPromotions(departmentName),
      ]);
      setDeptOverview(overview);
      setWorkloadData(work);
      setTaskData(tasks);
      setPayData(pay);
      setPromotionData(promo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionDrawer = async (signalId: number) => {
    try {
      const sig = await api.getSignalById(signalId);
      setSelectedSignal(sig);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !deptOverview) {
    return <LoadingSpinner message={`Loading analytics for ${departmentName}...`} />;
  }

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/departments')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Departments
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/reports?dept=${departmentName}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate {departmentName} Report
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {deptOverview.department.name} Department
            </h1>
            <SignalBadge status={deptOverview.department.status.toLowerCase()} size="md" />
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {deptOverview.department.description} • {deptOverview.department.head_count} Team Members
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Signals</span>
            <span className="font-bold text-slate-900 text-sm">{deptOverview.signals.length} Detected</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Department Overview', icon: Building2 },
          { id: 'workload', label: 'Workload Hours', icon: Clock },
          { id: 'tasks', label: 'Task Allocation', icon: CheckSquare },
          { id: 'pay', label: 'Pay & Increments', icon: DollarSign },
          { id: 'promotions', label: 'Promotion Progression', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Potential Equity Signals */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Potential Equity Signals Flagged for Review in {departmentName}
            </h2>

            {deptOverview.signals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                No active equity disparities detected in {departmentName}. Workforce distribution reflects organizational parity.
              </div>
            ) : (
              <div className="space-y-3">
                {deptOverview.signals.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SignalBadge status={s.severity} size="sm" />
                        <span className="text-xs font-bold text-slate-900">{s.title}</span>
                        <ConfidenceBadge confidence={s.confidence} />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {s.finding}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        <strong>Persistence:</strong> {s.persistence} • <strong>Observed Variance:</strong> {s.difference_value} {s.difference_unit}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenActionDrawer(s.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex-shrink-0 shadow-sm"
                    >
                      What should HR do?
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4 Pillar Snapshot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Workload Status</span>
                <SignalBadge status={deptOverview.pillar_summary.workload.status} size="sm" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {deptOverview.pillar_summary.workload.female_avg_hours}h (F) vs {deptOverview.pillar_summary.workload.male_avg_hours}h (M)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Delta: {deptOverview.pillar_summary.workload.difference_hours} hours/quarter
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Task Allocation</span>
                <SignalBadge status={deptOverview.pillar_summary.task_allocation.status} size="sm" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {deptOverview.pillar_summary.task_allocation.administrative_female_pct}% (F) vs {deptOverview.pillar_summary.task_allocation.administrative_male_pct}% (M)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Administrative Gap: {deptOverview.pillar_summary.task_allocation.largest_gap_pp} pp
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Pay Analysis</span>
                <SignalBadge status={deptOverview.pillar_summary.pay.status} size="sm" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {deptOverview.pillar_summary.pay.controlled_gap_pct}% Controlled
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Raw Gap: {deptOverview.pillar_summary.pay.raw_gap_pct}% (Controls applied)
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Promotions</span>
                <SignalBadge status={deptOverview.pillar_summary.promotions.status} size="sm" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {deptOverview.pillar_summary.promotions.female_rate_pct}% (F) vs {deptOverview.pillar_summary.promotions.male_rate_pct}% (M)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Gap: {deptOverview.pillar_summary.promotions.gap_pp} pp ({deptOverview.pillar_summary.promotions.trend_direction})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKLOAD */}
      {activeTab === 'workload' && workloadData && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Workload Distribution by Hours (Quarterly)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Comparing average quarterly hours and overtime concentration between female and male cohorts.
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData.distribution_by_gender}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Percentage of Cohort (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="female_pct" name="Female (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="male_pct" name="Male (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartExplainBox
              chartTitle="Workload Distribution by Hours"
              metric="workload_hours"
              department={departmentName}
              dataPoints={workloadData.distribution_by_gender}
              chartContext={`Average hours: ${workloadData.female_avg_hours}h (F) vs ${workloadData.male_avg_hours}h (M). Overtime rate: ${workloadData.overtime_distribution.female_overtime_pct}% (F) vs ${workloadData.overtime_distribution.male_overtime_pct}% (M).`}
            />
          </div>

          {/* Role Level Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">Workload Hours Breakdown by Role Title</h4>
            </div>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Role Title</th>
                  <th>Female Sample</th>
                  <th>Male Sample</th>
                  <th>Female Avg Hours</th>
                  <th>Male Avg Hours</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {workloadData.role_breakdown.map((r, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-900">{r.role_title}</td>
                    <td>{r.female_count}</td>
                    <td>{r.male_count}</td>
                    <td>{r.female_avg_hours}h</td>
                    <td>{r.male_avg_hours}h</td>
                    <td className={`font-semibold ${Math.abs(r.delta_hours) > 4.0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {r.delta_hours > 0 ? `+${r.delta_hours}` : r.delta_hours}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TASK ALLOCATION */}
      {activeTab === 'tasks' && taskData && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Category Proportions by Gender</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluates time allocation across administrative, strategic, client-facing, and leadership responsibilities.
                </p>
              </div>
              <SignalBadge status={taskData.signal_status} />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData.category_breakdown_table}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Share of Total Hours (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="female_pct" name="Female Time Share (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="male_pct" name="Male Time Share (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartExplainBox
              chartTitle="Task Category Proportions"
              metric="task_allocation"
              department={departmentName}
              dataPoints={taskData.category_breakdown_table}
              chartContext={`Administrative share: ${taskData.female_distribution.administrative}% (F) vs ${taskData.male_distribution.administrative}% (M). Strategic share: ${taskData.female_distribution.strategic}% (F) vs ${taskData.male_distribution.strategic}% (M).`}
            />
          </div>

          {/* Task Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">Category Comparison & Disparity (Percentage Points)</h4>
            </div>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Task Category</th>
                  <th>Female Time Share (%)</th>
                  <th>Male Time Share (%)</th>
                  <th>Difference (pp)</th>
                  <th>Female Hours Total</th>
                  <th>Male Hours Total</th>
                </tr>
              </thead>
              <tbody>
                {taskData.category_breakdown_table.map((row, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-900">{row.category}</td>
                    <td>{row.female_pct}%</td>
                    <td>{row.male_pct}%</td>
                    <td className={`font-semibold ${Math.abs(row.difference_pp) >= 12.0 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {row.difference_pp > 0 ? `+${row.difference_pp}` : row.difference_pp} pp
                    </td>
                    <td>{row.female_hours_total.toLocaleString()}h</td>
                    <td>{row.male_hours_total.toLocaleString()}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PAY ANALYSIS */}
      {activeTab === 'pay' && payData && (
        <div className="space-y-6">
          {/* Explanation Box for Controls */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs leading-relaxed text-indigo-950">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Comparable-Group Control Methodology:
            </p>
            <p>{payData.control_explanation}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Raw Median Pay Gap</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{payData.raw_difference_pct}%</p>
              <p className="text-[11px] text-slate-400 mt-1">₹{payData.raw_female_median.toLocaleString()} (F) vs ₹{payData.raw_male_median.toLocaleString()} (M)</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Controlled Pay Gap</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{payData.controlled_gap_pct}%</p>
              <p className="text-[11px] text-slate-400 mt-1">Adjusted for role title, seniority, & tenure</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Average Merit Increment</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{payData.increment_avg_female_pct}% (F) / {payData.increment_avg_male_pct}% (M)</p>
              <p className="text-[11px] text-slate-400 mt-1">Annual performance-linked increases</p>
            </div>
          </div>

          {/* Comparable Groups Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-900">Comparable-Group Stratification by Role & Seniority Band</h4>
            </div>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Role Title</th>
                  <th>Seniority Band</th>
                  <th>Sample (F / M)</th>
                  <th>Female Median</th>
                  <th>Male Median</th>
                  <th>Adjusted Variance</th>
                  <th>Reliability</th>
                </tr>
              </thead>
              <tbody>
                {payData.comparable_groups.map((g, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-slate-900">{g.role_title}</td>
                    <td>{g.seniority_level}</td>
                    <td>{g.sample_female}F / {g.sample_male}M</td>
                    <td>₹{g.female_median_salary.toLocaleString()}</td>
                    <td>₹{g.male_median_salary.toLocaleString()}</td>
                    <td className="font-semibold text-slate-800">{g.difference_pct}%</td>
                    <td>
                      {g.is_reliable_sample ? (
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Sufficient Sample
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Small Sample (n &lt; 3)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PROMOTIONS */}
      {activeTab === 'promotions' && promotionData && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Promotion Rate Tracking by Quarter (2024–2025)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Longitudinal progression tracking identifying widening vs narrowing promotion velocity.
                </p>
              </div>
              <SignalBadge status={promotionData.signal_status} />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={promotionData.quarters_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Promotion Rate (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="female_rate_pct" name="Female Promotion Rate (%)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="male_rate_pct" name="Male Promotion Rate (%)" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="gap_pp" name="Gap (pp)" stroke="#e11d48" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <ChartExplainBox
              chartTitle="Promotion Rate by Quarter"
              metric="promotion_rate"
              department={departmentName}
              dataPoints={promotionData.quarters_trend}
              chartContext={`Overall annual rate: ${promotionData.overall_female_rate_pct}% (F) vs ${promotionData.overall_male_rate_pct}% (M). Persistence: ${promotionData.persistence_quarters} quarters (${promotionData.trend_direction}).`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Average Tenure in Band Before Promotion</h4>
              <div className="mt-3 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-xs text-slate-500">Female</span>
                  <p className="text-xl font-bold text-slate-900">{promotionData.avg_tenure_before_promotion_female_months} mos</p>
                </div>
                <div className="text-center">
                  <span className="text-xs text-slate-500">Male</span>
                  <p className="text-xl font-bold text-slate-900">{promotionData.avg_tenure_before_promotion_male_months} mos</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Statistical Significance Check</h4>
              <div className="mt-3 space-y-1 text-xs text-slate-700">
                <p><strong>Test Name:</strong> {promotionData.statistical_test.test_name}</p>
                <p><strong>p-value:</strong> {promotionData.statistical_test.p_value ?? '< 0.05'}</p>
                <p><strong>Result:</strong> {promotionData.statistical_test.is_statistically_significant ? 'Statistically Significant (p < 0.05)' : 'Within Expected Sampling Variance'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Action Drawer Component */}
      <DecisionActionDrawer
        signal={selectedSignal}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateToReport={() => {
          setIsDrawerOpen(false);
          navigate(`/reports?dept=${departmentName}`);
        }}
      />
    </div>
  );
};
