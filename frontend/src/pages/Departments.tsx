import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, AlertTriangle, CheckCircle2, Filter, Users, FileText } from 'lucide-react';
import { api } from '../services/api';
import { SignalBadge } from '../components/ui/SignalBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Departments: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading department equity profiles..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Departments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare workforce metrics and potential equity signals across organizational departments.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          Generate Cross-Department Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => navigate(`/departments/${dept.name}`)}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Code: {dept.code}</span>
                </div>
                <SignalBadge status={dept.status.toLowerCase()} />
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {dept.head_count} Team Members
                </span>
                <span>
                  {dept.signals_count} Signal{dept.signals_count !== 1 ? 's' : ''} ({dept.review_signals_count} Review)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {dept.name === 'Sales' ? 'Persistent promotion & task disparity' :
                 dept.name === 'Operations' ? 'Moderate coordination workload' :
                 dept.name === 'Finance' ? 'Parity within seniority bands' : 'Balanced metrics'}
              </span>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Inspect <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
