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
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">{title}</p>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{value}</span>
            {delta && (
              <span className={`text-[11px] sm:text-xs font-medium ${
                deltaType === 'warning' ? 'text-amber-600' :
                deltaType === 'negative' ? 'text-rose-600' :
                deltaType === 'positive' ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {delta}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {Icon && (
            <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          {badge}
        </div>
      </div>
      {subtitle && (
        <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-slate-500 border-t border-slate-100 pt-2 sm:pt-2.5 leading-relaxed line-clamp-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
