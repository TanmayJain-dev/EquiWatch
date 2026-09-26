import React, { useEffect, useState } from 'react';
import { Landmark, ShieldAlert, TrendingUp, Building, Lock, FileText, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { api } from '../services/api';
import { GovernmentPreviewData } from '../types';
import { SignalBadge } from '../components/ui/SignalBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const GovernmentPreviewPage: React.FC = () => {
  const [data, setData] = useState<GovernmentPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGovPreview();
  }, []);

  const loadGovPreview = async () => {
    setLoading(true);
    try {
      const res = await api.getGovernmentPreview();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <LoadingSpinner message="Aggregating anonymized cross-sector equity benchmarks..." />;
  }

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/80 px-2 py-0.5 rounded mr-2">
            Future Scope
          </span>
          <strong className="text-slate-900">Demonstration Concept — Aggregated Policy & Sector Monitor</strong>
          <p className="mt-1 text-slate-700">
            This module represents future scope for policy-making bodies and industry regulatory oversight. In accordance with strict privacy principles, <strong>zero individual employee PII, individual salaries, or identifying records are exposed in this layer</strong>. Only high-level sector aggregates are surfaced.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Government & Sector Equity Monitor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated cross-industry equity signals, sector-wide controlled pay ratios, and policy recommendations.
          </p>
        </div>
      </div>

      {/* Sector Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {data.sectors.map((sec, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{sec.sector_name}</h3>
              <SignalBadge status={sec.sector_risk_status.toLowerCase()} size="sm" />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Sample Size:</span>
                <span className="font-semibold text-slate-800">{sec.aggregated_headcount.toLocaleString()} employees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monitored Orgs:</span>
                <span className="font-semibold text-slate-800">{sec.total_organisations} enterprises</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Controlled Pay Gap:</span>
                <span className="font-semibold text-slate-800">{sec.avg_controlled_pay_gap_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Promotion Parity:</span>
                <span className="font-semibold text-slate-800">{sec.promotion_parity_index} / 1.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Disparity Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Sector Risk Disparity Rates (2022–2025)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Percentage of monitored organizations in each sector exhibiting persistent review signals.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.aggregated_trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Organizations with Review Signals (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="mfg_risk" name="Manufacturing & Ops (%)" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="it_risk" name="Tech & SaaS (%)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bfsi_risk" name="Banking & Finance (%)" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Policy Recommendations */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Public Policy & Oversight Recommendations</h3>
        <div className="space-y-2">
          {data.policy_recommendations.map((rec, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start gap-2 text-xs text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
