import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Departments } from './pages/Departments';
import { DepartmentDetail } from './pages/DepartmentDetail';
import { WorkloadAnalysisPage } from './pages/WorkloadAnalysisPage';
import { TaskAllocationPage } from './pages/TaskAllocationPage';
import { PayAnalysisPage } from './pages/PayAnalysisPage';
import { PromotionAnalysisPage } from './pages/PromotionAnalysisPage';
import { SignalsPage } from './pages/SignalsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { GovernmentPreviewPage } from './pages/GovernmentPreviewPage';
import { ImpactSDGPage } from './pages/ImpactSDGPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected App Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/analytics/workload" element={<WorkloadAnalysisPage />} />
          <Route path="/analytics/tasks" element={<TaskAllocationPage />} />
          <Route path="/analytics/pay" element={<PayAnalysisPage />} />
          <Route path="/analytics/promotions" element={<PromotionAnalysisPage />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/data" element={<DataManagementPage />} />
          <Route path="/government-preview" element={<GovernmentPreviewPage />} />
          <Route path="/impact" element={<ImpactSDGPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
