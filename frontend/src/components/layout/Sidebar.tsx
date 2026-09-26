import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Clock, CheckSquare, DollarSign,
  TrendingUp, AlertTriangle, Sparkles, FileText, Database,
  Landmark, Globe, ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Departments', to: '/departments', icon: Building2 },
    { label: 'Workload', to: '/analytics/workload', icon: Clock },
    { label: 'Task Allocation', to: '/analytics/tasks', icon: CheckSquare },
    { label: 'Pay', to: '/analytics/pay', icon: DollarSign },
    { label: 'Promotions', to: '/analytics/promotions', icon: TrendingUp },
    { label: 'Signals', to: '/signals', icon: AlertTriangle },
    { label: 'AI Analyst', to: '/ai-assistant', icon: Sparkles, badge: 'AI' },
    { label: 'Reports', to: '/reports', icon: FileText },
    { label: 'Data', to: '/data', icon: Database },
    { label: 'Government Preview', to: '/government-preview', icon: Landmark, badge: 'Mock' },
    { label: 'SDG & Impact', to: '/impact', icon: Globe },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none">
      {/* Sidebar Nav items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Decision Support Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  item.badge === 'AI' ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / Principle Box */}
      <div className="p-3.5 m-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Core Principle</span>
        </div>
        <p className="text-slate-400 text-[10.5px]">
          EquiWatch identifies potential disparities for review. It does not decide whether discrimination occurred.
        </p>
      </div>
    </aside>
  );
};
