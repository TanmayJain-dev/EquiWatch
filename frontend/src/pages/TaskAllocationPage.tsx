import React, { useEffect, useState } from 'react';
import { CheckSquare, Filter, AlertTriangle, Building2, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { TaskAllocationAnalysis } from '../types';
import { SignalBadge, ConfidenceBadge } from '../components/ui/SignalBadge';
import { ChartExplainBox } from '../components/ui/ChartExplainBox';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const TaskAllocationPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('Sales');
  const [period, setPeriod] = useState('2025-Q4');
  const [data, setData] = useState<TaskAllocationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const departments = ['Sales', 'Operations', 'Finance', 'IT', 'HR'];

  useEffect(() => {
    loadTasks();
  }, [selectedDept, period]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks(selectedDept, period);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Calculating task allocation category distribution..." />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Task Allocation & Project Analysis
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Evaluating time spent on non-promotable administrative tasks vs high-visibility strategic and revenue projects.
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

      {/* KPI summary (2x2 on mobile, 4x1 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Primary Gap</span>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1 capitalize truncate">{data.largest_gap_category}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Largest task variance</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Observed Delta</span>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${Math.abs(data.largest_gap_pp) >= 12.0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {data.largest_gap_pp > 0 ? `+${data.largest_gap_pp}` : data.largest_gap_pp} pp
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Delta percentage points</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">High-Visibility</span>
          <p className="text-sm sm:text-lg font-bold text-slate-900 mt-1 truncate">
            {data.high_visibility_share.female_hivis_pct}% (F) / {data.high_visibility_share.male_hivis_pct}% (M)
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Strategic client pitches</p>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Status</span>
          <div className="mt-1.5">
            <SignalBadge status={data.signal_status} size="sm" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {data.statistical_summary.is_statistically_significant ? 'Statistically significant' : 'Normal variance'}
          </p>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
          Task Category Distribution ({selectedDept})
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mb-4">
          Percentage of total logged hours committed to each category by gender.
        </p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.category_breakdown_table}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Time Share (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="female_pct" name="Female Time Share (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="male_pct" name="Male Time Share (%)" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ChartExplainBox
          chartTitle="Task Category Distribution"
          metric="task_allocation"
          department={selectedDept}
          dataPoints={data.category_breakdown_table}
          chartContext={`Administrative share: ${data.female_distribution.administrative}% (F) vs ${data.male_distribution.administrative}% (M). Strategic share: ${data.female_distribution.strategic}% (F) vs ${data.male_distribution.strategic}% (M).`}
        />
      </div>

      {/* Task Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 sm:p-4 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-900">Task Allocation Details & Chi-Square Contingency Table</h4>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="saas-table min-w-[580px]">
            <thead>
              <tr>
                <th>Task Category</th>
                <th>Female Time Share (%)</th>
                <th>Male Time Share (%)</th>
                <th>Difference (pp)</th>
                <th>Female Hours</th>
                <th>Male Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.category_breakdown_table.map((row, i) => (
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
    </div>
  );
};
