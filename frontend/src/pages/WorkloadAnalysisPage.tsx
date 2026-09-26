import React, { useEffect, useState } from 'react';
import { Clock, Filter, Sparkles, Building2 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { WorkloadAnalysis } from '../types';
import { SignalBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const WorkloadAnalysisPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('Sales');
  const [period, setPeriod] = useState('2025-Q4');
  const [data, setData] = useState<WorkloadAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const departments = ['Sales', 'Operations', 'Finance', 'IT', 'HR'];

  useEffect(() => {
    loadWorkload();
  }, [selectedDept, period]);

  const loadWorkload = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkload(selectedDept, period);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Calculating workload distribution metrics..." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Workload & Hours Distribution
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Analyzing logged quarterly hours, capacity allocation, and overtime distribution by gender and role.
          </p>
        </div>

        {/* Filter controls */}
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

      {/* KPI Cards (2x2 on mobile, 4x1 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Average Hours</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.overall_avg_hours}h</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Quarterly average</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Female Avg</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.female_avg_hours}h</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Sample: {data.statistical_summary.sample_size_female}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Male Avg</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{data.male_avg_hours}h</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Sample: {data.statistical_summary.sample_size_male}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Status</span>
          <div className="mt-1.5">
            <SignalBadge status={data.signal_status} size="sm" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">Variance: {data.difference_hours}h</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Workload Distribution ({selectedDept})</h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mb-4">
          Proportion of employees in each hours tier for {period}.
        </p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.distribution_by_gender}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="female_pct" name="Female (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="male_pct" name="Male (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ChartExplainBox
          chartTitle="Workload Distribution"
          metric="workload_hours"
          department={selectedDept}
          dataPoints={data.distribution_by_gender}
          chartContext={`Average hours: ${data.female_avg_hours}h (F) vs ${data.male_avg_hours}h (M). Overtime rate: ${data.overtime_distribution.female_overtime_pct}% (F) vs ${data.overtime_distribution.male_overtime_pct}% (M).`}
        />
      </div>

      {/* Role Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-900">Workload Breakdown by Role Title ({selectedDept})</h4>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="saas-table min-w-[560px]">
            <thead>
              <tr>
                <th>Role Title</th>
                <th>Female Count</th>
                <th>Male Count</th>
                <th>Female Avg (h)</th>
                <th>Male Avg (h)</th>
                <th>Variance (h)</th>
              </tr>
            </thead>
            <tbody>
              {data.role_breakdown.map((r, i) => (
                <tr key={i}>
                  <td className="font-semibold text-slate-900">{r.role_title}</td>
                  <td>{r.female_count}</td>
                  <td>{r.male_count}</td>
                  <td>{r.female_avg_hours}h</td>
                  <td>{r.male_avg_hours}h</td>
                  <td className={`font-semibold ${Math.abs(r.delta_hours) > 4 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {r.delta_hours > 0 ? `+${r.delta_hours}` : r.delta_hours}h
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
