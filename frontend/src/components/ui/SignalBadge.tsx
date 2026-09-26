import React from 'react';

interface SignalBadgeProps {
  status: 'review' | 'moderate' | 'normal' | 'insufficient_data' | string;
  size?: 'sm' | 'md' | 'lg';
  labelOverride?: string;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ status, size = 'md', labelOverride }) => {
  const norm = status?.toLowerCase() || 'normal';

  let classes = 'inline-flex items-center font-medium rounded-md border';
  let label = labelOverride;

  if (size === 'sm') {
    classes += ' px-2 py-0.5 text-xs';
  } else if (size === 'lg') {
    classes += ' px-3 py-1.5 text-sm';
  } else {
    classes += ' px-2.5 py-1 text-xs';
  }

  if (norm === 'review') {
    classes += ' bg-rose-50 text-rose-700 border-rose-200';
    label = label || 'Review Recommended';
  } else if (norm === 'moderate') {
    classes += ' bg-amber-50 text-amber-700 border-amber-200';
    label = label || 'Moderate Variance';
  } else if (norm === 'insufficient_data') {
    classes += ' bg-slate-100 text-slate-600 border-slate-200';
    label = label || 'Insufficient Sample';
  } else {
    classes += ' bg-emerald-50 text-emerald-700 border-emerald-200';
    label = label || 'Normal Parity';
  }

  return (
    <span className={classes}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        norm === 'review' ? 'bg-rose-500' :
        norm === 'moderate' ? 'bg-amber-500' :
        norm === 'insufficient_data' ? 'bg-slate-400' : 'bg-emerald-500'
      }`} />
      {label}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ confidence: 'high' | 'moderate' | 'low' | string }> = ({ confidence }) => {
  const c = confidence?.toLowerCase() || 'moderate';
  let classes = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ';
  if (c === 'high') {
    classes += 'bg-slate-100 text-slate-800 border-slate-300';
  } else if (c === 'moderate') {
    classes += 'bg-slate-50 text-slate-600 border-slate-200';
  } else {
    classes += 'bg-slate-50 text-slate-400 border-slate-200';
  }

  return (
    <span className={classes} title={`Analytical Confidence: ${confidence}`}>
      Confidence: {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
    </span>
  );
};
