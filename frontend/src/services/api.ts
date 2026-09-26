import {
  User, DashboardSummary, WorkloadAnalysis, TaskAllocationAnalysis, PayAnalysis,
  PromotionAnalysis, EquitySignal, AIInsightResponse, AIChartExplainResponse,
  AIChatResponse, Report, BenchmarkValidationResult, GovernmentPreviewData
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('equiwatch_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errorMsg;
        } catch {
          // ignore json parse error
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (err: any) {
      console.error(`API Request Error [${endpoint}]:`, err);
      throw err;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; role: string; email: string; full_name: string }> {
    const res = await this.request<{ access_token: string; role: string; email: string; full_name: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('equiwatch_token', res.access_token);
    localStorage.setItem('equiwatch_user', JSON.stringify(res));
    return res;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  logout() {
    localStorage.removeItem('equiwatch_token');
    localStorage.removeItem('equiwatch_user');
  }

  getCurrentUser(): { email: string; role: string; full_name: string } | null {
    const data = localStorage.getItem('equiwatch_user');
    return data ? JSON.parse(data) : null;
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>('/dashboard/summary');
  }

  // Departments
  async getDepartments(): Promise<any[]> {
    return this.request<any[]>('/departments');
  }

  async getDepartmentOverview(name: string, period: string = '2025-Q4'): Promise<any> {
    return this.request<any>(`/departments/${name}/overview?period=${period}`);
  }

  // Analytics
  async getWorkload(department: string = 'Sales', period: string = '2025-Q4'): Promise<WorkloadAnalysis> {
    return this.request<WorkloadAnalysis>(`/analytics/workload?department=${department}&period=${period}`);
  }

  async getTasks(department: string = 'Sales', period: string = '2025-Q4'): Promise<TaskAllocationAnalysis> {
    return this.request<TaskAllocationAnalysis>(`/analytics/tasks?department=${department}&period=${period}`);
  }

  async getPay(department: string = 'Sales', period: string = '2025-Q4'): Promise<PayAnalysis> {
    return this.request<PayAnalysis>(`/analytics/pay?department=${department}&period=${period}`);
  }

  async getPromotions(department: string = 'Sales', period: string = '2025-Q4'): Promise<PromotionAnalysis> {
    return this.request<PromotionAnalysis>(`/analytics/promotions?department=${department}&period=${period}`);
  }

  async getTrends(): Promise<any> {
    return this.request<any>('/analytics/trends');
  }

  // Signals
  async getSignals(params: { department?: string; severity?: string; metric?: string } = {}): Promise<EquitySignal[]> {
    const query = new URLSearchParams();
    if (params.department) query.append('department', params.department);
    if (params.severity) query.append('severity', params.severity);
    if (params.metric) query.append('metric', params.metric);
    return this.request<EquitySignal[]>(`/signals?${query.toString()}`);
  }

  async getSignalById(id: number): Promise<EquitySignal> {
    return this.request<EquitySignal>(`/signals/${id}`);
  }

  async updateSignal(id: number, data: { status?: string; notes?: string }): Promise<EquitySignal> {
    return this.request<EquitySignal>(`/signals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // AI
  async getAIInsight(payload: { department: string; metric: string; signal_id?: number; context_data?: any }): Promise<AIInsightResponse> {
    return this.request<AIInsightResponse>('/ai/insight', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async explainChart(payload: { chart_title: string; metric: string; department: string; data_points: any[]; chart_context?: string }): Promise<AIChartExplainResponse> {
    return this.request<AIChartExplainResponse>('/ai/explain-chart', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async chatWithAnalyst(payload: { message: string; history?: any[]; department_filter?: string }): Promise<AIChatResponse> {
    return this.request<AIChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Reports
  async listReports(): Promise<Report[]> {
    return this.request<Report[]>('/reports');
  }

  async getReport(id: number): Promise<Report> {
    return this.request<Report>(`/reports/${id}`);
  }

  async generateReport(department_name: string, period: string = '2025-Q4'): Promise<Report> {
    return this.request<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify({ department_name, period }),
    });
  }

  // Data
  async getDataSummary(): Promise<any> {
    return this.request<any>('/data/summary');
  }

  async seedDemo(): Promise<any> {
    return this.request<any>('/data/seed', { method: 'POST' });
  }

  async resetDemo(): Promise<any> {
    return this.request<any>('/data/reset', { method: 'POST' });
  }

  async uploadCSV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = this.getToken();

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/data/upload-csv`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Government Preview
  async getGovernmentPreview(): Promise<GovernmentPreviewData> {
    return this.request<GovernmentPreviewData>('/government/preview');
  }

  // Validation Benchmark
  async getValidationBenchmark(): Promise<BenchmarkValidationResult> {
    return this.request<BenchmarkValidationResult>('/validation/benchmark');
  }
}

export const api = new ApiClient();
