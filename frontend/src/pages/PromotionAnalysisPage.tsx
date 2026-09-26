import React, { useEffect, useState } from 'react';
import { TrendingUp, Filter, Sparkles, Building2, Clock, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { PromotionAnalysis } from '../types';
import { SignalBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const PromotionAnalysisPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('Sales');
  const [period, setPeriod] = useState('2025-Q4');
  const [data, setData] = useState<PromotionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const departments = ['Sales', 'Operations', 'Finance', 'IT', 'HR'];

  useEffect(() => {
    loadPromotions();
  }, [selectedDept, period]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const res = await api.getPromotions(selectedDept, period);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Calculating promotion progression analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Promotion Rate & Velocity Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing longitudinal advancement rates, progression timelines, and time-in-role before promotion.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2 sm:py-1.5 focus:outline-none shadow-sm"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d} Department</option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2 sm:py-1.5 focus:outline-none shadow-sm"
          >
            <option value="2025-Q4">2025-Q4 (Latest)</option>
            <option value="2025-Q3">2025-Q3</option>
            <option value="2025-Q2">2025-Q2</option>
            <option value="2025-Q1">2025-Q1</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Female Rate</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.overall_female_rate_pct}%</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Annualized rate</p>
        </div>
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Male Rate</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.overall_male_rate_pct}%</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Annualized rate</p>
        </div>
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Disparity</span>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${Math.abs(data.gap_pp) >= 6.0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {data.gap_pp} pp
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Trend: {data.trend_direction}</p>
        </div>
        <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
          <div className="mt-1.5">
            <SignalBadge status={data.signal_status} />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">Persistence: {data.persistence_quarters} qtrs</p>
        </div>
      </div>

      {/* Multi-Quarter Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Quarterly Promotion Trajectory ({selectedDept})
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking promotion rates and widening gap across 8 consecutive quarters.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.quarters_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Promotion Rate (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="female_rate_pct" name="Female Rate (%)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="male_rate_pct" name="Male Rate (%)" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="gap_pp" name="Gap (pp)" stroke="#e11d48" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChartExplainBox
          chartTitle="Quarterly Promotion Trajectory"
          metric="promotion_rate"
          department={selectedDept}
          dataPoints={data.quarters_trend}
          chartContext={`Annual rate: ${data.overall_female_rate_pct}% (F) vs ${data.overall_male_rate_pct}% (M). Gap trend: ${data.trend_direction} across ${data.persistence_quarters} quarters.`}
        />
      </div>

      {/* Progression by Level Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Progression Volume by Level Transition</h4>
          <div className="space-y-3">
            {data.progression_by_level.map((lvl, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{lvl.level_transition}</span>
                <span className="text-slate-600 font-medium">
                  {lvl.female_promotions} Female / {lvl.male_promotions} Male
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900">Advancement Velocity & Statistical Significance</h4>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs text-slate-700">
            <p><strong>Average Tenure in Band (Female):</strong> {data.avg_tenure_before_promotion_female_months} months</p>
            <p><strong>Average Tenure in Band (Male):</strong> {data.avg_tenure_before_promotion_male_months} months</p>
            <p className="text-slate-500 pt-1">Velocity difference: {Math.abs(data.avg_tenure_before_promotion_female_months - data.avg_tenure_before_promotion_male_months).toFixed(1)} months slower</p>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded border border-indigo-200 text-xs text-indigo-950">
            <p><strong>Statistical Test:</strong> {data.statistical_test.test_name}</p>
            <p><strong>p-value:</strong> {data.statistical_test.p_value ?? '< 0.05'}</p>
            <p><strong>Result:</strong> {data.statistical_test.is_statistically_significant ? 'Statistically significant persistent disparity.' : 'Sampling variance within expected alpha bounds.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
