import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText, Download, Printer, Plus, Building2, CheckCircle2,
  AlertTriangle, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Report } from '../types';
import { SignalBadge } from '../components/ui/SignalBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ReportsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') || 'Sales';

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetDept, setTargetDept] = useState(initialDept);

  const departments = ['Sales', 'Operations', 'Finance', 'IT', 'HR'];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.listReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      } else {
        // Automatically generate initial report for Sales if none exist
        await handleGenerateReport('Sales');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (dept: string) => {
    setGenerating(true);
    try {
      const newReport = await api.generateReport(dept, '2025-Q4');
      setReports((prev) => [newReport, ...prev]);
      setSelectedReport(newReport);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Loading workplace equity review reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Workplace Equity Review Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal decision-support review dossiers compiling findings, signals, and recommended investigation roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={targetDept}
            onChange={(e) => setTargetDept(e.target.value)}
            className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded px-3 py-2 sm:py-1.5 focus:outline-none shadow-sm"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d} Department</option>
            ))}
          </select>

          <button
            onClick={() => handleGenerateReport(targetDept)}
            disabled={generating}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            {generating ? 'Generating...' : 'New Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Reports List (horizontal scroll on mobile, vertical on desktop) */}
        <div className="lg:col-span-1 space-y-2 print:hidden">
          <p className="text-xs uppercase font-bold text-slate-400 px-1 mb-1">Available Reports ({reports.length})</p>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:max-h-[calc(100vh-16rem)] pr-1">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-3 sm:p-3.5 rounded-lg border text-xs cursor-pointer transition-all flex-shrink-0 w-64 lg:w-auto ${
                  selectedReport?.id === rep.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm font-semibold text-indigo-900'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{rep.department_name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{rep.period}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{rep.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Printable Detailed Report Dossier */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
              {/* Dossier Header */}
              <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-900 text-white rounded">
                      EquiWatch Review Dossier
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Period: {selectedReport.period}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedReport.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Author: {selectedReport.author_email} • Generated: {new Date(selectedReport.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Executive Summary</h3>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedReport.summary}
                </div>
              </div>

              {/* Detected Signals Table */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Detected Potential Equity Signals</h3>
                <div className="space-y-2.5">
                  {selectedReport.equity_signals.map((s: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{s.title}</span>
                        <SignalBadge status={s.severity} size="sm" />
                      </div>
                      <p className="text-slate-700">{s.finding}</p>
                      <p className="text-[11px] text-slate-400">
                        Observed Delta: <strong>{s.difference}</strong> • Persistence: <strong>{s.persistence}</strong> • Confidence: <strong>{s.confidence}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar Findings */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Multi-Pillar Analytical Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedReport.findings.map((f: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{f.area}</span>
                        <SignalBadge status={f.status} size="sm" />
                      </div>
                      <p className="text-slate-700">{f.metric_summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended HR Action Roadmap */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Recommended Action Roadmap</h3>
                <div className="space-y-2">
                  {selectedReport.recommended_actions.map((act: string, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded flex items-start gap-2.5 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HR Investigation Questions */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Guided Investigation Questions for Department Leads</h3>
                <div className="space-y-2">
                  {selectedReport.investigation_questions.map((q: string, idx: number) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded flex items-start gap-2.5 text-xs text-slate-800">
                      <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal & Decision Support Compliance Footnote */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Compliance Notice:</strong> This review dossier is generated as an internal decision-support aid to assist human resource professionals in investigating workforce allocation. EquiWatch does not establish legal discrimination or intent.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">
              Select a report from the list or generate a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
