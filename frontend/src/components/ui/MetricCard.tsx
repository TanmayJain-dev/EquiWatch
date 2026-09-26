import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'neutral' | 'positive' | 'warning' | 'negative';
  icon?: LucideIcon;
  badge?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  deltaType = 'neutral',
  icon: Icon,
  badge
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {delta && (
              <span className={`text-xs font-medium ${
                deltaType === 'warning' ? 'text-amber-600' :
                deltaType === 'negative' ? 'text-rose-600' :
                deltaType === 'positive' ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {delta}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {Icon && (
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100 text-slate-600">
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge}
        </div>
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
