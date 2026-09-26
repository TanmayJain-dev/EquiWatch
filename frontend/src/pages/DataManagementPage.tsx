import React, { useEffect, useState } from 'react';
import {
  Database, UploadCloud, RefreshCw, CheckCircle2, AlertCircle,
  FileSpreadsheet, ShieldAlert, Download, Check
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const DataManagementPage: React.FC = () => {
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadDataSummary();
  }, []);

  const loadDataSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getDataSummary();
      setDataSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await api.seedDemo();
      alert('Demo data regenerated with full synthetic records and recalculated signals.');
      await loadDataSummary();
    } catch (err: any) {
      alert(`Seed failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    setUploadResult(null);

    try {
      const res = await api.uploadCSV(file);
      setUploadResult(res);
      await loadDataSummary();
    } catch (err: any) {
      setUploadResult({
        success: false,
        validation_errors: [err.message || 'CSV upload failed.'],
        warnings: [],
        message: 'Upload error'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `employee_id,gender,department,role,seniority,experience_years,task_category,task_name,hours,salary,bonus,increment,promotion,project_type,date
EMP-101,Female,Sales,Account Executive,Mid,3.5,administrative,Pipeline Hygiene,210,1100000,80000,8.5,0,internal_ops,2025-10-15
EMP-102,Male,Sales,Account Executive,Mid,3.6,strategic,Key Account Pitch,190,1120000,95000,9.0,1,client_core,2025-10-15
EMP-103,Female,IT,Software Engineer,Mid,4.0,technical,Backend Microservice,490,1350000,100000,10.0,0,innovation,2025-10-15
EMP-104,Male,IT,Software Engineer,Mid,4.2,technical,Cloud Infra Deployment,505,1380000,110000,10.0,0,innovation,2025-10-15
EMP-105,Female,Finance,Financial Analyst,Junior,1.8,operational,Quarterly FP&A,495,680000,45000,7.0,0,standard,2025-10-15`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'equiwatch_workforce_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !dataSummary) {
    return <LoadingSpinner message="Loading dataset telemetry and storage records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Workforce Data Management & CSV Ingestion
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage organizational workforce datasets, upload structured HR CSVs, or regenerate synthetic demo sets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample CSV Template
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Regenerating...' : 'Regenerate Demo Data'}
          </button>
        </div>
      </div>

      {/* Dataset Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Employees</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.total_employees}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Departments</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.total_departments}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Task Records</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.total_task_records.toLocaleString()}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Comp Logs</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.total_compensation_records.toLocaleString()}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Career Events</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.total_career_events}</p>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Signals</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{dataSummary.active_equity_signals}</p>
        </div>
      </div>

      {/* CSV Upload Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-indigo-600" />
          Upload Workforce CSV
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Upload multi-period workforce CSV records. EquiWatch automatically performs schema validation, type checks, missing column verification, duplicate employee deduplication, and calculates updated equity signals.
        </p>

        {/* Drag & Drop Area */}
        <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-slate-700">
            {uploading ? 'Validating and importing records...' : 'Click to select CSV file or drag and drop here'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Supported columns: employee_id, gender, department, role, seniority, experience_years, task_category, hours, salary, bonus, increment, promotion
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Upload Result Feedback Box */}
        {uploadResult && (
          <div className={`p-4 rounded-lg border text-xs space-y-2 ${
            uploadResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {uploadResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{uploadResult.message}</span>
            </div>

            {uploadResult.success && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-emerald-800">
                <span>Rows Processed: <strong>{uploadResult.rows_processed}</strong></span>
                <span>Employees Created: <strong>{uploadResult.employees_created}</strong></span>
                <span>Tasks Logged: <strong>{uploadResult.task_records_created}</strong></span>
                <span>Promotions Logged: <strong>{uploadResult.promotions_created}</strong></span>
              </div>
            )}

            {uploadResult.validation_errors && uploadResult.validation_errors.length > 0 && (
              <div className="pt-2 border-t border-rose-200 text-rose-800 space-y-1">
                <span className="font-semibold block">Validation Errors Encountered:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {uploadResult.validation_errors.map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {uploadResult.warnings && uploadResult.warnings.length > 0 && (
              <div className="pt-1 text-amber-800 space-y-1 text-[11px]">
                <span className="font-semibold block">Warnings:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {uploadResult.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Synthetic Dataset Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-800">Demo Synthetic Dataset Grounding</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            This deployment is populated with the verified <strong>NovaWorks</strong> synthetic benchmark dataset (1,200+ employees, 5 departments, 8 longitudinal quarterly tracking windows). It intentionally models both real-world controlled parity (e.g. Finance controlled salary parity) and genuine longitudinal review signals (e.g. Sales non-promotable task allocation and promotion velocity).
          </p>
        </div>
      </div>
    </div>
  );
};
