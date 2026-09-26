from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="hr_admin")  # hr_admin, viewer, government
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    head_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    employees = relationship("Employee", back_populates="department_rel")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_code = Column(String(50), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(String(20), nullable=False)  # Female, Male, Non-Binary, etc.
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    department_name = Column(String(100), nullable=False)
    role_title = Column(String(150), nullable=False)
    seniority_level = Column(String(50), nullable=False)  # Junior, Mid, Senior, Lead, Executive
    experience_years = Column(Float, nullable=False)
    performance_score = Column(Float, default=3.5) # 1.0 to 5.0
    joining_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    department_rel = relationship("Department", back_populates="employees")
    tasks = relationship("TaskRecord", back_populates="employee", cascade="all, delete-orphan")
    compensations = relationship("Compensation", back_populates="employee", cascade="all, delete-orphan")
    career_events = relationship("CareerEvent", back_populates="employee", cascade="all, delete-orphan")

class TaskRecord(Base):
    __tablename__ = "task_records"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    task_name = Column(String(255), nullable=False)
    task_category = Column(String(50), nullable=False)  # administrative, coordination, operational, technical, strategic, client-facing, leadership
    hours_allocated = Column(Float, nullable=False)
    quarter = Column(String(10), nullable=False)  # Q1, Q2, Q3, Q4
    year = Column(Integer, nullable=False)        # 2024, 2025
    period_key = Column(String(20), index=True, nullable=False) # e.g. 2024-Q1
    project_type = Column(String(100), nullable=True) # internal_ops, client_core, innovation, committee
    is_high_visibility = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="tasks")

class Compensation(Base):
    __tablename__ = "compensations"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    base_salary = Column(Float, nullable=False)
    bonus = Column(Float, default=0.0)
    increment_pct = Column(Float, default=0.0)
    total_comp = Column(Float, nullable=False)
    quarter = Column(String(10), nullable=False)
    year = Column(Integer, nullable=False)
    period_key = Column(String(20), index=True, nullable=False)
    effective_date = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="compensations")

class CareerEvent(Base):
    __tablename__ = "career_events"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    event_type = Column(String(50), nullable=False)  # promotion, leadership_assignment, recognition, retention_risk
    from_level = Column(String(50), nullable=True)
    to_level = Column(String(50), nullable=True)
    quarter = Column(String(10), nullable=False)
    year = Column(Integer, nullable=False)
    period_key = Column(String(20), index=True, nullable=False)
    event_date = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="career_events")

class EquitySignal(Base):
    __tablename__ = "equity_signals"

    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), index=True, nullable=False)
    metric = Column(String(50), index=True, nullable=False)  # task_allocation, promotion_rate, pay_gap, workload_hours
    severity = Column(String(20), index=True, nullable=False)  # review, moderate, normal
    title = Column(String(255), nullable=False)
    finding = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    why_flagged = Column(Text, nullable=False)
    suggested_review = Column(Text, nullable=False)
    hr_questions = Column(JSON, nullable=True)
    
    # Statistical / Context groundings
    observed_female_val = Column(Float, nullable=True)
    observed_male_val = Column(Float, nullable=True)
    difference_value = Column(Float, nullable=False)
    difference_unit = Column(String(20), default="pp")  # pp, %, hours, INR
    raw_difference = Column(Float, nullable=True)
    controlled_difference = Column(Float, nullable=True)
    persistence = Column(String(100), nullable=False)
    quarters_persistent = Column(Integer, default=1)
    confidence = Column(String(20), default="moderate")  # high, moderate, low
    sample_size = Column(Integer, nullable=False)
    sample_size_female = Column(Integer, nullable=False)
    sample_size_male = Column(Integer, nullable=False)
    statistical_test = Column(String(100), nullable=True)
    p_value = Column(Float, nullable=True)
    comparable_group_valid = Column(Boolean, default=True)
    control_variables = Column(JSON, nullable=True)
    
    # Status workflow
    status = Column(String(50), default="active") # active, investigating, resolved, acknowledged
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department_name = Column(String(100), nullable=False)
    report_type = Column(String(50), default="department_review") # department_review, executive_summary, comprehensive
    period = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    findings = Column(JSON, nullable=False)
    equity_signals = Column(JSON, nullable=False)
    recommended_actions = Column(JSON, nullable=False)
    investigation_questions = Column(JSON, nullable=False)
    author_email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalysisSnapshot(Base):
    __tablename__ = "analysis_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), index=True, nullable=False)
    period_key = Column(String(50), index=True, nullable=False)
    metric_type = Column(String(50), index=True, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
