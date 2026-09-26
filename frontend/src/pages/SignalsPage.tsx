import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Filter, ArrowRight, CheckCircle2, Search,
  Clock, ShieldAlert, Sparkles, FileText, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { EquitySignal } from '../types';
import { SignalBadge, ConfidenceBadge } from '../components/ui/SignalBadge';
import { DecisionActionDrawer } from '../components/ui/DecisionActionDrawer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const SignalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<EquitySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState<EquitySignal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadSignals();
  }, [severityFilter, deptFilter]);

  const loadSignals = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (severityFilter !== 'all') params.severity = severityFilter;
      if (deptFilter !== 'all') params.department = deptFilter;
      const data = await api.getSignals(params);
      setSignals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (sig: EquitySignal) => {
    setSelectedSignal(sig);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return <LoadingSpinner message="Evaluating potential equity signals..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Potential Equity Signals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic patterns detected by comparing multi-dimensional workforce records against calibrated baseline thresholds.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2 sm:py-1.5 focus:outline-none shadow-sm"
          >
            <option value="all">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2 sm:py-1.5 focus:outline-none shadow-sm"
          >
            <option value="all">All Severities</option>
            <option value="review">Review Recommended</option>
            <option value="moderate">Moderate Variance</option>
          </select>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-4">
        {signals.length === 0 ? (
          <div className="p-8 sm:p-10 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No active equity signals matching the selected criteria.
          </div>
        ) : (
          signals.map((sig) => (
            <div
              key={sig.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <SignalBadge status={sig.severity} size="sm" />
                  <span className="text-xs font-bold text-slate-900">{sig.department_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-medium capitalize">{sig.metric.replace('_', ' ')}</span>
                  <ConfidenceBadge confidence={sig.confidence} />
                  <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Persistence: {sig.persistence}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{sig.title}</h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{sig.finding}</p>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  <strong>Why Flagged:</strong> {sig.why_flagged}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span><strong>Sample:</strong> {sig.sample_size} records</span>
                  <span><strong>Observed Delta:</strong> {sig.difference_value} {sig.difference_unit}</span>
                  {sig.p_value && <span><strong>p-value:</strong> {sig.p_value}</span>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 flex-shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => handleOpenAction(sig)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  What should HR do?
                </button>
                <button
                  onClick={() => navigate(`/departments/${sig.department_name}`)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors text-center md:text-right"
                >
                  View Deep-Dive →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DecisionActionDrawer
        signal={selectedSignal}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateToReport={() => {
          setIsDrawerOpen(false);
          if (selectedSignal) navigate(`/reports?dept=${selectedSignal.department_name}`);
        }}
      />
    </div>
  );
};
