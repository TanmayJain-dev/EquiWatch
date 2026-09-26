import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { AIChartExplainResponse } from '../../types';

interface ChartExplainBoxProps {
  chartTitle: string;
  metric: string;
  department: string;
  dataPoints: any[];
  chartContext?: string;
}

export const ChartExplainBox: React.FC<ChartExplainBoxProps> = ({
  chartTitle,
  metric,
  department,
  dataPoints,
  chartContext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<AIChartExplainResponse | null>(null);

  const handleExplain = async () => {
    if (!isOpen && !explanation) {
      setLoading(true);
      try {
        const res = await api.explainChart({
          chart_title: chartTitle,
          metric,
          department,
          data_points: dataPoints,
          chart_context: chartContext,
        });
        setExplanation(res);
      } catch (err) {
        console.error('Failed to explain chart', err);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
      <button
        onClick={handleExplain}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Explain this trend with AI</span>
          <span className="text-[11px] text-slate-400 font-normal">(interprets verified data)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 bg-white space-y-3 text-xs leading-relaxed text-slate-700">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing longitudinal data points...</span>
            </div>
          ) : explanation ? (
            <>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-medium text-slate-900">{explanation.summary}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Observations
                </p>
                <ul className="space-y-1 pl-4 list-disc text-slate-600">
                  {explanation.key_observations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-slate-500">
                <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p><strong className="text-slate-700">Contextual Note:</strong> {explanation.contextual_caveats}</p>
              </div>

              <div className="bg-indigo-50/70 p-2.5 rounded border border-indigo-100 text-indigo-900 font-medium">
                <strong>Suggested HR Focus:</strong> {explanation.hr_takeaway}
              </div>

              <div className="text-[10px] text-slate-400 text-right">
                Interpreted by {explanation.source_model}
              </div>
            </>
          ) : (
            <p className="text-slate-500">Could not retrieve explanation. Verified numbers remain visible above.</p>
          )}
        </div>
      )}
    </div>
  );
};
