import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, AlertTriangle, Sparkles, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
  activeSignalsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMenu,
  activeSignalsCount = 2,
}) => {
  const tabs = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Departments', to: '/departments', icon: Building2 },
    { label: 'Signals', to: '/signals', icon: AlertTriangle, badgeCount: activeSignalsCount },
    { label: 'AI Analyst', to: '/ai-assistant', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 lg:hidden px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {Boolean(tab.badgeCount && tab.badgeCount > 0) && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Open full navigation menu"
        >
          <Menu className="w-5 h-5 text-slate-600" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium text-slate-600">All Tabs</span>
        </button>
      </div>
    </nav>
  );
};
