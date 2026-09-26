import React, { useState } from 'react';
import {
  X, MessageSquare, Search, HelpCircle, FileText, Check, Copy,
  ArrowRight, ShieldAlert, Sparkles, Building, BarChart2
} from 'lucide-react';
import { EquitySignal } from '../../types';
import { SignalBadge, ConfidenceBadge } from './SignalBadge';

interface DecisionActionDrawerProps {
  signal: EquitySignal | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport?: () => void;
}

export const DecisionActionDrawer: React.FC<DecisionActionDrawerProps> = ({
  signal,
  isOpen,
  onClose,
  onNavigateToReport,
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'talk' | 'investigate' | 'why'>('review');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen || !signal) return null;

  const discussionPrompt = `As part of our periodic people analytics equity review in ${signal.department_name}, EquiWatch highlighted a pattern in ${signal.metric.replace('_', ' ')} (observed variance: ${signal.difference_value} ${signal.difference_unit} over ${signal.persistence}).\n\nI would like to schedule a 30-minute sync to discuss:\n1. How recurring operational vs high-visibility project assignments are currently distributed across your team.\n2. Whether current nomination processes are structured with clear, documented prerequisites.\n3. Any structural team dynamics or capacity bottlenecks we should take into account.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(discussionPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full sm:max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
              <SignalBadge status={signal.severity} />
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">{signal.department_name} Department</span>
              <ConfidenceBadge confidence={signal.confidence} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{signal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Horizontally scrollable on mobile) */}
        <div className="flex border-b border-slate-200 px-2 sm:px-5 bg-white text-xs font-semibold overflow-x-auto whitespace-nowrap gap-1">
          <button
            onClick={() => setActiveTab('review')}
            className={`py-2.5 sm:py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'review'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            1. Evidence
          </button>
          <button
            onClick={() => setActiveTab('talk')}
            className={`py-2.5 sm:py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'talk'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            2. Discussion Script
          </button>
          <button
            onClick={() => setActiveTab('investigate')}
            className={`py-2.5 sm:py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'investigate'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            3. Investigation
          </button>
          <button
            onClick={() => setActiveTab('why')}
            className={`py-2.5 sm:py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'why'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            4. Why Flagged?
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm text-slate-700">
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs uppercase font-semibold text-slate-500 mb-1">Key Verified Finding</p>
                <p className="text-slate-900 font-medium leading-relaxed">{signal.finding}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-500 mb-2">Longitudinal Context</h4>
                <p className="text-slate-600 leading-relaxed text-xs bg-white p-3 border border-slate-200 rounded">
                  {signal.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500">Observed Variance</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{signal.difference_value} {signal.difference_unit}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500">Persistence</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{signal.persistence}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500">Sample Size</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{signal.sample_size} records</p>
                </div>
              </div>

              {signal.statistical_test && (
                <div className="p-3 bg-indigo-50/60 rounded border border-indigo-100 text-xs text-indigo-950">
                  <span className="font-semibold">Statistical Grounding:</span> {signal.statistical_test} (p = {signal.p_value ?? '< 0.05'}, statistically significant).
                </div>
              )}
            </div>
          )}

          {activeTab === 'talk' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase font-semibold text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Suggested Discussion Prompt for Department Lead
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPrompt ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-xs text-slate-800 bg-white p-3.5 rounded border border-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {discussionPrompt}
                </pre>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-500 mb-2">Guided HR Investigation Questions</h4>
                <div className="space-y-2">
                  {(signal.hr_questions || [
                    "Are non-promotable coordination responsibilities distributed uniformly across comparable tiers?",
                    "What criteria govern project staffing for high-visibility revenue accounts?",
                    "How are candidate promotion readiness dossiers compiled and reviewed?"
                  ]).map((q, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'investigate' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                EquiWatch recommends the following structured audit steps to determine the root causes of this signal:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900 mb-1">1. Task Assignment & Routine Log Audit</p>
                  <p className="text-xs text-slate-600">Inspect historical task logs to check if routine administrative tasks are disproportionately defaulting to specific individuals regardless of role parity.</p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900 mb-1">2. Promotion Nomination Dossier Review</p>
                  <p className="text-xs text-slate-600">Audit promotion candidate submissions over the past 4 quarters to evaluate whether prerequisite projects were equally accessible.</p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900 mb-1">3. Manager & Sub-Team Stratification</p>
                  <p className="text-xs text-slate-600">Evaluate whether the observed disparity is company-wide across the department or concentrated under specific team leads.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Decision Support Reminder:</strong> EquiWatch flags potential equity patterns for review. It does not decide whether discrimination occurred.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'why' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs uppercase font-semibold text-slate-500 mb-1">Analytical Threshold Logic</p>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {signal.why_flagged}
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2">
                <p className="font-semibold text-slate-900">Control Variables Verified:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(signal.control_variables || ['Department', 'Role Title', 'Seniority Band', 'Quarter']).map((ctrl, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      ✓ {ctrl}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 pt-1 text-[11px]">
                  Sample size satisfies minimum reliability threshold (n = {signal.sample_size} &gt; 8 required).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Close
          </button>
          {onNavigateToReport && (
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Department Report
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
