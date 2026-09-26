import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Clock, CheckSquare, DollarSign,
  TrendingUp, AlertTriangle, Sparkles, FileText, Database,
  Landmark, Globe, ShieldCheck, X, Shield
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
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

  const renderNavContent = (isMobile: boolean = false) => (
    <>
      {isMobile && (
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm">EquiWatch</span>
              <p className="text-[10px] text-slate-400 font-medium">Decision Support Navigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sidebar Nav items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isMobile && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Decision Support Navigation
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (isMobile && onClose) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 active:bg-slate-800'
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on lg+) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col flex-shrink-0 border-r border-slate-800 select-none">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Sliding drawer */}
          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
