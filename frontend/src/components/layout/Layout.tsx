import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenMenu={() => setMobileMenuOpen(true)} />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-3.5 sm:p-6 lg:p-8 pb-24 sm:pb-8">
          <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Thumb-friendly mobile bottom navigation bar */}
      <MobileBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />
    </div>
  );
};
