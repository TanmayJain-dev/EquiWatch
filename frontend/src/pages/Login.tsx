import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('hr@novaworks.com');
  const [password, setPassword] = useState('equiwatch2025');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: 'hr' | 'admin' | 'viewer' | 'gov') => {
    if (role === 'hr') {
      setEmail('hr@novaworks.com');
      setPassword('equiwatch2025');
    } else if (role === 'admin') {
      setEmail('admin@novaworks.com');
      setPassword('admin2025');
    } else if (role === 'viewer') {
      setEmail('viewer@novaworks.com');
      setPassword('viewer2025');
    } else {
      setEmail('gov_monitor@policy.org');
      setPassword('policy2025');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          EquiWatch
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Detect. Explain. Act. — Workplace Equity Decision Support
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 shadow-sm border border-slate-200 rounded-xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign in to EquiWatch'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Single-Click Demo Quick Logins */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('hr')}
                className={`px-3 py-2 text-left rounded border text-xs transition-colors ${
                  email === 'hr@novaworks.com' ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>HR Lead (Demo)</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Full Analytics & Reports</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className={`px-3 py-2 text-left rounded border text-xs transition-colors ${
                  email === 'admin@novaworks.com' ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-700" />
                  <span>Admin Role</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Full System Access</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('viewer')}
                className={`px-3 py-2 text-left rounded border text-xs transition-colors ${
                  email === 'viewer@novaworks.com' ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Viewer Role</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Read-Only Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('gov')}
                className={`px-3 py-2 text-left rounded border text-xs transition-colors ${
                  email === 'gov_monitor@policy.org' ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Policy Auditor</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Aggregated Anonymized</span>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy reminder */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Synthetic dataset generated for demonstration. No live employee PII is stored.
        </p>
      </div>
    </div>
  );
};
