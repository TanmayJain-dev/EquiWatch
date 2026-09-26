import React, { useState } from 'react';
import { Shield, Sparkles, RefreshCw, UserCheck, LogOut, CheckCircle2, ChevronDown, Lock, Menu } from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onRefreshData?: () => void;
  onOpenMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefreshData, onOpenMenu }) => {
  const [resetting, setResetting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = api.getCurrentUser() || { email: 'hr@novaworks.com', full_name: 'Priya Sharma (HR Lead)', role: 'hr_admin' };

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await api.resetDemo();
      if (onRefreshData) onRefreshData();
      alert('Demo data successfully reset to initial NovaWorks state.');
    } catch (err) {
      console.error(err);
      alert('Failed to reset demo.');
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center justify-between px-3 sm:px-6">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <a href="/dashboard" className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">EquiWatch</span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                SaaS v1.0
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 font-medium tracking-wide">
              Detect. Explain. Act.
            </p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Demo data — synthetic workforce dataset
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            <Lock className="w-3 h-3 text-slate-400" /> Role-Gated Privacy
          </span>
        </div>
      </div>

      {/* Actions & User profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleResetDemo}
          disabled={resetting}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
          title="Reset synthetic data and recalculated equity signals"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Resetting Demo...' : 'Reset Demo'}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user.full_name}</p>
              <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">{user.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in-50 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">{user.full_name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded text-[10px]">
                  Role: {user.role}
                </span>
              </div>
              <a
                href="/data"
                className="block px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                Data Management & CSV Import
              </a>
              <a
                href="/impact"
                className="block px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                SDG Impact & Business Model
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors border-t border-slate-100 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
