# EquiWatch Architecture & Technical Specification

**Tagline:** Detect. Explain. Act.  
**Core Role:** AI-Powered Workplace Gender-Equity Decision-Support System

---

## 1. System Philosophy & Non-Negotiables

EquiWatch is strictly an **evidence-based decision-support system**, not an autonomous decision-maker or legal adjudicator.

1. **No Data Hallucinations**: The Python analytics layer calculates all underlying metrics, sample sizes, and p-values. The AI layer only receives verified numbers.
2. **Neutral Decision-Support Language**: The system uses objective phrasing (*"potential disparity"*, *"pattern detected"*, *"review recommended"*), never asserting guilt, discrimination, or legal liability.
3. **Controlled Fairness Checks**: The system tests whether raw disparities disappear when controlling for Role Title, Seniority Tier, Experience, and Department.
4. **Empirical Precision**: Accuracy and recall are grounded in actual test benchmarks, never fabricated percentages.

---

## 2. End-to-End Data Pipeline

```text
RAW WORKFORCE DATA (CSV / Synthetic HRIS)
        │
        ▼
DATA CLEANING & VALIDATION (Schema check, deduplication, type coercion)
        │
        ▼
RELATIONAL STORAGE (SQLAlchemy ORM: Employee, TaskRecord, Compensation, CareerEvent)
        │
        ▼
ANALYTICS ENGINE (SciPy, Pandas, NumPy, StatsModels)
├── Workload Analysis (Mann-Whitney U, Hours Distribution)
├── Task Allocation (Chi-Square Test of Task Proportions)
├── Pay & Compensation (Comparable-Group Controls, Stratified Medians)
└── Promotions & Velocity (Longitudinal Multi-Quarter Trend, 2-Proportion Chi-Square)
        │
        ▼
SIGNAL DETECTION ENGINE
├── Effect Size Thresholds
├── Sample Size Safeguards (n >= 8)
└── Persistence Detection (Multi-Quarter Tracking)
        │
        ▼
AI INTERPRETATION LAYER (Grounded Prompting + Fallback Engine)
├── Finding & Explanation Generation
├── "What should HR do?" Action Prompts & Lead Discussion Scripts
├── "Explain this trend with AI" Chart Interpretations
└── Conversational AI Analyst Assistant with Metric Citations
        │
        ▼
USER INTERFACE (React, TypeScript, Tailwind CSS, Recharts)
├── Main Workplace Equity Overview & Needs Review Queue
├── Department Deep-Dives
├── Granular Metric Analysis (Workload, Tasks, Pay, Promotions)
├── Executive Review Reports (Print / PDF Export)
├── Data Ingestion & Drag-and-Drop CSV Validator
└── Government Aggregated Sector Preview (Future Scope, Zero PII)
```

---

## 3. Tech Stack Details

### Backend
- **Framework**: FastAPI (Async Python 3.9+)
- **Validation**: Pydantic v2
- **ORM / Database**: SQLAlchemy 2.0 (SQLite for local zero-config, PostgreSQL for cloud)
- **Analytics & Statistics**: SciPy 1.13, Pandas 2.2, NumPy 2.0, Scikit-learn 1.6
- **Authentication**: JWT Bearer Tokens (`python-jose`, `bcrypt`)
- **Testing**: Pytest with automated unit & regression fixtures

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS (Restrained SaaS design system)
- **Visualizations**: Recharts (Responsive SVG charts with interactive tooltips)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

---

## 4. Analytical Methods & Statistical Grounding

| Pillar | Raw Metric | Control Methodology | Statistical Test | Threshold for Review Signal |
| :--- | :--- | :--- | :--- | :--- |
| **Workload** | Total hours logged / quarter | Role title breakdown | Mann-Whitney U test | $\Delta \ge 4.0\text{ hours/quarter}$ with $p < 0.05$ |
| **Task Allocation** | Share of time in 7 categories | Role + Seniority cohort | Chi-Square test of proportions | $\Delta \ge 12.0\text{ pp}$ on Administrative/Coordination tasks |
| **Pay & Comp** | Raw median base salary | Controlled cohort stratification | Stratified Mann-Whitney U | Controlled gap $\ge 5.0\%$ within identical role & level |
| **Promotions** | Annualized advancement rate | Level transition & time in role | Two-proportion Chi-square test | $\Delta \ge 6.0\text{ pp}$ persistent across $\ge 4$ quarters |

---

## 5. Security & Privacy Architecture

- **Role-Based Access Control (RBAC)**:
  - `hr_admin`: Full access to organizational data, signals, reports, and AI assistant.
  - `viewer`: Read-only access to analytics dashboards.
  - `government`: Mock policy role restricted exclusively to aggregated, anonymized sector metrics with **zero individual employee PII leakage**.
- **Password Security**: Direct salt-hashed bcrypt algorithms with timing attack resistance.
- **Fail-Safe Offline Mode**: If external LLM APIs are unreachable, the local rule engine provides instant, deterministic natural language explanations.
