import React, { useEffect, useState } from 'react';
import { DollarSign, Filter, Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { PayAnalysis } from '../types';
import { SignalBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const PayAnalysisPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('Finance');
  const [period, setPeriod] = useState('2025-Q4');
  const [data, setData] = useState<PayAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const departments = ['Finance', 'Sales', 'IT', 'Operations', 'HR'];

  useEffect(() => {
    loadPay();
  }, [selectedDept, period]);

  const loadPay = async () => {
    setLoading(true);
    try {
      const res = await api.getPay(selectedDept, period);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Calculating comparable-group pay analytics..." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Pay & Compensation Equity Analysis
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Evaluating raw median compensation against comparable-group controls (Role Title + Seniority Band + Tenure).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="flex-1 sm:flex-initial text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none shadow-sm"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d} Dept</option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex-1 sm:flex-initial text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none shadow-sm"
          >
            <option value="2025-Q4">2025-Q4 (Latest)</option>
            <option value="2025-Q3">2025-Q3</option>
            <option value="2025-Q2">2025-Q2</option>
            <option value="2025-Q1">2025-Q1</option>
          </select>
        </div>
      </div>

      {/* Fairness & Context Check Alert */}
      <div className="p-3.5 sm:p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs leading-relaxed text-indigo-950 flex items-start gap-2.5 sm:gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900 mb-0.5">Fairness & Context Checking Pipeline</p>
          <p className="text-slate-700 text-[11px] sm:text-xs">{data.control_explanation}</p>
        </div>
      </div>

      {/* KPI Cards: Raw vs Controlled (2x2 on mobile, 4x1 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Raw Pay Gap</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.raw_difference_pct}%</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Unadjusted median</p>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Controlled Gap</span>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">{data.controlled_gap_pct}%</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Controlled by role & level</p>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Merit Increment</span>
          <p className="text-sm sm:text-lg font-bold text-slate-900 mt-1 truncate">
            {data.increment_avg_female_pct}% (F) / {data.increment_avg_male_pct}% (M)
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Performance raise</p>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Status</span>
          <div className="mt-1.5">
            <SignalBadge status={data.signal_status} size="sm" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {data.is_gap_explained_by_controls ? 'Controlled parity' : 'Controlled alignment'}
          </p>
        </div>
      </div>

      {/* Salary Bands Distribution Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
          Salary Band Distribution ({selectedDept})
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mb-4">
          Distribution of female and male employees across annual compensation bands.
        </p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.salary_bands_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="band" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="female_share_pct" name="Female Share (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="male_share_pct" name="Male Share (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ChartExplainBox
          chartTitle="Salary Band Distribution"
          metric="pay_gap"
          department={selectedDept}
          dataPoints={data.salary_bands_distribution}
          chartContext={`Raw median gap: ${data.raw_difference_pct}%. Controlled gap: ${data.controlled_gap_pct}%. ${data.control_explanation}`}
        />
      </div>

      {/* Comparable Groups Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-900">Comparable-Group Cohort Breakdown</h4>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="saas-table min-w-[640px]">
            <thead>
              <tr>
                <th>Role Title</th>
                <th>Seniority Band</th>
                <th>Sample Size (F / M)</th>
                <th>Female Median (₹)</th>
                <th>Male Median (₹)</th>
                <th>Adjusted Gap (%)</th>
                <th>Sample Reliability</th>
              </tr>
            </thead>
            <tbody>
              {data.comparable_groups.map((g, i) => (
                <tr key={i}>
                  <td className="font-semibold text-slate-900">{g.role_title}</td>
                  <td>{g.seniority_level}</td>
                  <td>{g.sample_female}F / {g.sample_male}M</td>
                  <td>₹{g.female_median_salary.toLocaleString()}</td>
                  <td>₹{g.male_median_salary.toLocaleString()}</td>
                  <td className="font-semibold text-slate-800">{g.difference_pct}%</td>
                  <td>
                    {g.is_reliable_sample ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Reliable (n ≥ 3)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Insufficient sample
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
