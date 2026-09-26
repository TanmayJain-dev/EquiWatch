import React, { useEffect, useState } from 'react';
import {
  Globe, ShieldCheck, Heart, Award, Building, DollarSign,
  BarChart, CheckCircle2, RefreshCw, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { BenchmarkValidationResult } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ImpactSDGPage: React.FC = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkValidationResult | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  useEffect(() => {
    runBenchmark();
  }, []);

  const runBenchmark = async () => {
    setLoadingBenchmark(true);
    try {
      const res = await api.getValidationBenchmark();
      setBenchmark(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Impact, UN SDGs & SaaS Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grounded alignment with Sustainable Development Goals, commercial SaaS delivery model, and empirical validation metrics.
          </p>
        </div>
      </div>

      {/* UN Sustainable Development Goals (SDGs) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          United Nations Sustainable Development Goals (SDG) Alignment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SDG 5 */}
          <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded">
                PRIMARY TARGET
              </span>
              <span className="text-xs font-bold text-rose-800">Target 5.5</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">SDG 5 — Gender Equality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              EquiWatch assists organizations in identifying systemic barriers to equal opportunity in leadership tracks, non-promotable task allocations, and promotion velocity.
            </p>
          </div>

          {/* SDG 8 */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded">
                SUPPORTING
              </span>
              <span className="text-xs font-bold text-amber-800">Target 8.5</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">SDG 8 — Decent Work & Economic Growth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Promoting transparent remuneration benchmarks and fair workload capacity distribution to ensure equal pay for work of equal value.
            </p>
          </div>

          {/* SDG 10 */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded">
                SUPPORTING
              </span>
              <span className="text-xs font-bold text-indigo-800">Target 10.3</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">SDG 10 — Reduced Inequalities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providing objective, statistical decision support to eliminate disparities in organizational outcomes and career progression pathways.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic pt-1">
          * EquiWatch does not claim to autonomously solve workplace inequality; it serves as a decision-support watchdog empowering HR teams with verifiable evidence.
        </p>
      </div>

      {/* SECTION 30: Genuine Internal Empirical Benchmark Validation Script */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Empirical Analytical Benchmark & Validation Harness
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live evaluation measuring true positives, recall, precision, and false alert rate across 100 calibrated synthetic control scenarios.
            </p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={loadingBenchmark}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBenchmark ? 'animate-spin' : ''}`} />
            Re-run Benchmark Harness
          </button>
        </div>

        {loadingBenchmark || !benchmark ? (
          <LoadingSpinner message="Executing 100 test harness scenarios..." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Recall Rate</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{benchmark.recall_pct}%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{benchmark.true_signals_detected} / {benchmark.true_signals_injected} true signals detected</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Precision</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{benchmark.precision_pct}%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Calculated honestly from control runs</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">False Alert Rate</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{benchmark.false_alert_rate_pct}%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{benchmark.false_alerts_triggered} false alerts across 50 null controls</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Statistical Consistency</span>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{benchmark.statistical_consistency_score}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Overall F-accuracy agreement score</p>
              </div>
            </div>

            {/* Test Sample Breakdown Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg mt-3">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Metric Type</th>
                    <th>Sample Size</th>
                    <th>Injected Effect</th>
                    <th>Applied Threshold</th>
                    <th>Ground Truth</th>
                    <th>Detection Result</th>
                    <th>Benchmark Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmark.test_breakdown.map((row) => (
                    <tr key={row.case_id}>
                      <td className="font-semibold text-slate-900">{row.case_id}</td>
                      <td className="capitalize">{row.metric_type.replace('_', ' ')}</td>
                      <td>n = {row.sample_size}</td>
                      <td>{row.injected_effect}</td>
                      <td>≥ {row.threshold_applied}</td>
                      <td>{row.ground_truth}</td>
                      <td className="font-medium">{row.detection_result}</td>
                      <td>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          row.outcome.includes('True Positive') ? 'bg-emerald-50 text-emerald-700' :
                          row.outcome.includes('True Negative') ? 'bg-slate-100 text-slate-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {row.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* B2B SaaS Business & Deployment Model */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-800" />
          B2B SaaS Business & Deployment Model
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">1. Tiered Recurring SaaS</h3>
            <p className="text-slate-600 leading-relaxed">
              Per-employee per-month (PEPM) subscription designed for mid-market and enterprise employers (500 to 50,000+ employees) seeking continuous equity audit readiness.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">2. HRIS & Payroll Integrations</h3>
            <p className="text-slate-600 leading-relaxed">
              Standard connectors for Workday, BambooHR, ADP, and Jira task trackers with automated privacy anonymization and end-to-end encryption.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">3. Periodic Equity Dossiers</h3>
            <p className="text-slate-600 leading-relaxed">
              Automated quarterly review generation for board reporting, ESG disclosures, and proactive regulatory risk mitigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
