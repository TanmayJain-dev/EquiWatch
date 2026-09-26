import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, AlertTriangle, CheckCircle2, ArrowRight,
  TrendingUp, Clock, Filter, Sparkles, HelpCircle, FileText, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { DashboardSummary, EquitySignal, NeedsReviewItem } from '../types';
import { MetricCard } from '../components/ui/MetricCard';
import { SignalBadge, ConfidenceBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { DecisionActionDrawer } from '../components/ui/DecisionActionDrawer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSignal, setSelectedSignal] = useState<EquitySignal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionDrawer = async (item: NeedsReviewItem) => {
    try {
      const sig = await api.getSignalById(item.id);
      setSelectedSignal(sig);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !summary) {
    return <LoadingSpinner message="Calculating organization-wide equity analytics..." />;
  }

  const filteredDepts = summary.department_overview.filter((d) => {
    if (statusFilter === 'review') return d.status === 'Review';
    if (statusFilter === 'moderate') return d.status === 'Moderate';
    if (statusFilter === 'normal') return d.status === 'Normal';
    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Workplace Equity Overview
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Decision-support monitoring across 5 departments at {summary.company_name} • Last updated: {summary.last_updated}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Analyst Chat
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Review Report
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards (2x2 on mobile, 4x1 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <MetricCard
          title="Total Workforce"
          value={summary.total_employees.toLocaleString()}
          subtitle="Monitored across 8 quarterly historical cycles"
          icon={Users}
        />
        <MetricCard
          title="Departments"
          value={summary.total_departments}
          subtitle="IT, Sales, Finance, Operations, HR"
          icon={Building2}
        />
        <MetricCard
          title="Equity Signals"
          value={summary.active_signals_count}
          subtitle="Patterns exceeding baseline thresholds"
          icon={AlertTriangle}
          deltaType={summary.active_signals_count > 0 ? 'warning' : 'positive'}
        />
        <MetricCard
          title="Needs Review"
          value={summary.signals_requiring_review}
          subtitle="Longitudinal, persistent disparities"
          icon={Clock}
          badge={<SignalBadge status="review" size="sm" labelOverride={`${summary.signals_requiring_review} Priority`} />}
        />
      </div>

      {/* "Where should HR look first?" (Needs Review Priority Queue) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Where Should HR Look First? (Needs Review)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Prioritized queue of active equity signals showing statistical persistence across multiple quarters.
            </p>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">Click any row to open actionable investigation steps</span>
        </div>

        {summary.needs_review_queue.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
            No active review signals detected across current baseline.
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {summary.needs_review_queue.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenActionDrawer(item)}
                className="p-3.5 sm:p-4 bg-rose-50/40 hover:bg-rose-50/80 active:bg-rose-100/70 border border-rose-200/80 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{item.department}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700 capitalize">{item.metric.replace('_', ' ')}</span>
                    <SignalBadge status="review" size="sm" />
                    <ConfidenceBadge confidence={item.confidence} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Disparity:</strong> {item.observed_difference} • <strong>Persistence:</strong> {item.persistence}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 sm:line-clamp-1">
                    {item.suggested_review}
                  </p>
                </div>

                <div className="flex items-center sm:self-center pt-1 sm:pt-0">
                  <button
                    className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-slate-900 bg-white group-hover:bg-slate-900 group-hover:text-white border border-slate-300 group-hover:border-slate-900 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>What should HR do?</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Department Equity Overview */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              Department Equity Overview
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Comprehensive status across Workload, Task Allocation, Pay, and Promotions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Statuses ({summary.department_overview.length})</option>
              <option value="review">Review Recommended</option>
              <option value="moderate">Moderate Variance</option>
              <option value="normal">Normal Parity</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Clean Responsive Cards */}
        <div className="block md:hidden divide-y divide-slate-100 p-2">
          {filteredDepts.map((d) => (
            <div
              key={d.name}
              onClick={() => navigate(`/departments/${d.name}`)}
              className="p-3 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900">{d.name}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({d.code} • {d.head_count} staff)</span>
                </div>
                <SignalBadge status={d.status.toLowerCase()} size="sm" />
              </div>

              {/* 4 pillar mini-grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">Workload:</span>
                  <span className={`font-semibold text-[10.5px] ${d.workload_status === 'Review' ? 'text-rose-600' : d.workload_status === 'Moderate' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {d.workload_status}
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">Tasks:</span>
                  <span className={`font-semibold text-[10.5px] ${d.task_allocation_status === 'Review' ? 'text-rose-600' : d.task_allocation_status === 'Moderate' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {d.task_allocation_status}
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">Pay:</span>
                  <span className={`font-semibold text-[10.5px] ${d.pay_status === 'Review' ? 'text-rose-600' : d.pay_status === 'Moderate' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {d.pay_status}
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">Promotions:</span>
                  <span className={`font-semibold text-[10.5px] ${d.promotion_status === 'Review' ? 'text-rose-600' : d.promotion_status === 'Moderate' ? 'text-amber-600' : 'text-slate-700'}`}>
                    {d.promotion_status}
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-end text-xs font-semibold text-indigo-600">
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table with Horizontal Scroll Protection */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="saas-table min-w-[680px]">
            <thead>
              <tr>
                <th>Department</th>
                <th>Headcount</th>
                <th>Workload</th>
                <th>Task Allocation</th>
                <th>Pay Analysis</th>
                <th>Promotions</th>
                <th>Overall Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepts.map((d) => (
                <tr key={d.name} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/departments/${d.name}`)}>
                  <td className="font-semibold text-slate-900">
                    <div>
                      <span>{d.name}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">{d.code}</span>
                    </div>
                  </td>
                  <td className="text-slate-600">{d.head_count}</td>
                  <td>
                    <span className={`text-xs font-medium ${d.workload_status === 'Review' ? 'text-rose-600 font-semibold' : d.workload_status === 'Moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                      {d.workload_status}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs font-medium ${d.task_allocation_status === 'Review' ? 'text-rose-600 font-semibold' : d.task_allocation_status === 'Moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                      {d.task_allocation_status}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs font-medium ${d.pay_status === 'Review' ? 'text-rose-600 font-semibold' : d.pay_status === 'Moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                      {d.pay_status}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs font-medium ${d.promotion_status === 'Review' ? 'text-rose-600 font-semibold' : d.promotion_status === 'Moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                      {d.promotion_status}
                    </span>
                  </td>
                  <td>
                    <SignalBadge status={d.status.toLowerCase()} size="sm" />
                  </td>
                  <td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/departments/${d.name}`);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Longitudinal 8-Quarter Equity Trend Analysis */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Longitudinal Equity Disparity Trends (2024-Q1 to 2025-Q4)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Tracks persistence and gap widening across quarters to distinguish stochastic noise from structural patterns.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.quarterly_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Disparity (pp)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="sales_task_gap" name="Sales Admin Task Disparity (pp)" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sales_promo_gap" name="Sales Promotion Gap (pp)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="total_signals" name="Active Signals Count" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChartExplainBox
          chartTitle="Longitudinal Equity Disparity Trends"
          metric="promotion_rate"
          department="Sales"
          dataPoints={summary.quarterly_trends}
          chartContext="Tracks 8 consecutive quarters of workforce data showing the emergence and widening of disparities in Sales."
        />
      </div>

      {/* Decision Action Drawer Component */}
      <DecisionActionDrawer
        signal={selectedSignal}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateToReport={() => {
          setIsDrawerOpen(false);
          if (selectedSignal) {
            navigate(`/reports?dept=${selectedSignal.department_name}`);
          }
        }}
      />
    </div>
  );
};
