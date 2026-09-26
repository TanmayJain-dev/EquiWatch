import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import (
    User, Department, Employee, TaskRecord, Compensation, CareerEvent, EquitySignal
)
from app.core.security import get_password_hash
from app.core.config import settings

# Deterministic seed for reproducible demo datasets
SEED_VALUE = 42

FIRST_NAMES_FEMALE = [
    "Aanya", "Priya", "Ananya", "Diya", "Rhea", "Kavya", "Tanvi", "Neha", "Ishita", "Sanya",
    "Sarah", "Emily", "Elena", "Maya", "Pooja", "Zoya", "Meera", "Aarti", "Simran", "Nisha",
    "Aditi", "Shreya", "Ritu", "Deepa", "Sneha", "Kriti", "Anushka", "Tara", "Radhika", "Leila"
]

FIRST_NAMES_MALE = [
    "Aarav", "Rohan", "Vikram", "Arjun", "Kabir", "Aditya", "Rahul", "Siddharth", "Karan", "Neil",
    "Alex", "David", "Marcus", "Leo", "Amit", "Dev", "Raj", "Samir", "Nikhil", "Varun",
    "Pranav", "Gaurav", "Harsh", "Akash", "Manish", "Tushar", "Suresh", "Vishal", "Yash", "Ayush"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Mehta", "Deshmukh", "Kapoor", "Malhotra", "Nair", "Iyer", "Rao",
    "Gupta", "Bose", "Joshi", "Chopra", "Kaur", "Singh", "Reddy", "Menon", "Saxena", "Sen",
    "Miller", "Smith", "Taylor", "Anderson", "Davies", "Clark", "Wright", "Walker", "Hall", "Young"
]

DEPARTMENT_SPECS = [
    {
        "name": "IT",
        "code": "TECH",
        "description": "Software Engineering, Cloud Infrastructure, QA, and Data Systems",
        "roles": [
            ("Associate Software Engineer", "Junior", 1.5, 750000),
            ("Software Engineer", "Mid", 3.5, 1250000),
            ("Senior Software Engineer", "Senior", 6.5, 2100000),
            ("Staff Engineer", "Lead", 10.0, 3200000),
            ("VP Engineering", "Executive", 15.0, 4800000),
            ("Data Scientist", "Mid", 4.0, 1400000),
            ("DevOps Specialist", "Senior", 6.0, 2000000),
        ],
        "headcount": 320,
        "female_ratio": 0.42
    },
    {
        "name": "Sales",
        "code": "SLS",
        "description": "Enterprise Sales, Account Management, Revenue Operations, and Business Development",
        "roles": [
            ("Sales Development Rep", "Junior", 1.2, 550000),
            ("Account Executive", "Mid", 3.8, 1050000),
            ("Senior Account Executive", "Senior", 6.2, 1750000),
            ("Enterprise Sales Lead", "Lead", 9.5, 2700000),
            ("VP Sales", "Executive", 14.5, 4500000),
        ],
        "headcount": 280,
        "female_ratio": 0.48
    },
    {
        "name": "Finance",
        "code": "FIN",
        "description": "Corporate Finance, FP&A, Risk Assessment, Accounting, and Treasury",
        "roles": [
            ("Financial Analyst", "Junior", 1.8, 650000),
            ("Senior Financial Analyst", "Mid", 4.2, 1150000),
            ("Finance Manager", "Senior", 7.0, 1900000),
            ("Treasury Lead", "Lead", 10.5, 2900000),
            ("Chief Financial Officer", "Executive", 17.0, 5200000),
        ],
        "headcount": 190,
        "female_ratio": 0.50
    },
    {
        "name": "Operations",
        "code": "OPS",
        "description": "Global Supply Chain, Process Logistics, Customer Operations, and Project Delivery",
        "roles": [
            ("Operations Associate", "Junior", 1.5, 500000),
            ("Operations Specialist", "Mid", 3.5, 900000),
            ("Project Coordinator", "Mid", 4.0, 950000),
            ("Operations Manager", "Senior", 7.5, 1650000),
            ("VP Operations", "Executive", 15.0, 4200000),
        ],
        "headcount": 270,
        "female_ratio": 0.52
    },
    {
        "name": "HR",
        "code": "PPL",
        "description": "People Operations, Talent Acquisition, Total Rewards, and Org Development",
        "roles": [
            ("People Operations Associate", "Junior", 1.5, 520000),
            ("Talent Partner", "Mid", 3.6, 950000),
            ("HR Business Partner", "Senior", 6.8, 1700000),
            ("Head of People Operations", "Lead", 10.0, 2600000),
            ("Chief People Officer", "Executive", 16.0, 4400000),
        ],
        "headcount": 140,
        "female_ratio": 0.62
    }
]

PERIODS = [
    ("2024-Q1", "Q1", 2024),
    ("2024-Q2", "Q2", 2024),
    ("2024-Q3", "Q3", 2024),
    ("2024-Q4", "Q4", 2024),
    ("2025-Q1", "Q1", 2025),
    ("2025-Q2", "Q2", 2025),
    ("2025-Q3", "Q3", 2025),
    ("2025-Q4", "Q4", 2025),
]

def generate_synthetic_dataset(db: Session, force_reset: bool = True) -> dict:
    """
    Generates a full synthetic dataset for NovaWorks with realistic distributions,
    controlled comparable groups, and genuine reproducible equity signals.
    """
    random.seed(SEED_VALUE)

    if force_reset:
        # Clear existing transactional and analytic records
        db.query(EquitySignal).delete()
        db.query(CareerEvent).delete()
        db.query(Compensation).delete()
        db.query(TaskRecord).delete()
        db.query(Employee).delete()
        db.query(Department).delete()
        db.query(User).delete()
        db.commit()

    # 1. Seed Users
    users = [
        User(
            email=settings.DEMO_HR_EMAIL,
            hashed_password=get_password_hash(settings.DEMO_HR_PASSWORD),
            full_name="Priya Sharma (HR Lead)",
            role="hr_admin",
            department="HR"
        ),
        User(
            email=settings.DEMO_ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.DEMO_ADMIN_PASSWORD),
            full_name="System Administrator",
            role="hr_admin",
            department="IT"
        ),
        User(
            email=settings.DEMO_VIEWER_EMAIL,
            hashed_password=get_password_hash(settings.DEMO_VIEWER_PASSWORD),
            full_name="Marcus Vance (Department Viewer)",
            role="viewer",
            department="Sales"
        ),
        User(
            email=settings.DEMO_GOV_EMAIL,
            hashed_password=get_password_hash(settings.DEMO_GOV_PASSWORD),
            full_name="Dr. Aruna Sengupta (Policy Auditor)",
            role="government",
            department="Policy Compliance"
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Seed Departments
    dept_map = {}
    for spec in DEPARTMENT_SPECS:
        dept = Department(
            name=spec["name"],
            code=spec["code"],
            description=spec["description"],
            head_count=spec["headcount"]
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)
        dept_map[spec["name"]] = dept

    # 3. Seed Employees with Realistic Attributes
    created_employees = []
    emp_counter = 1001

    for spec in DEPARTMENT_SPECS:
        dept = dept_map[spec["name"]]
        dept_name = spec["name"]
        headcount = spec["headcount"]
        female_ratio = spec["female_ratio"]

        # Level distributions (Pyramid shape: 35% Junior, 35% Mid, 20% Senior, 8% Lead, 2% Executive)
        for i in range(headcount):
            is_female = random.random() < female_ratio
            gender = "Female" if is_female else "Male"
            first_name = random.choice(FIRST_NAMES_FEMALE if is_female else FIRST_NAMES_MALE)
            last_name = random.choice(LAST_NAMES)

            # Role picking with intentional nuance
            num_roles = len(spec["roles"])
            if dept_name == "Finance":
                weights = [35, 35, 18, 8, 4] if not is_female else [38, 36, 18, 7, 1]
            elif dept_name == "IT":
                weights = [25, 25, 15, 8, 2, 13, 12]  # matches 7 roles
            else:
                weights = [35, 35, 18, 9, 3] if num_roles == 5 else [100 // num_roles] * num_roles

            role_spec = random.choices(spec["roles"], weights=weights)[0]

            role_title, seniority, base_exp, base_sal = role_spec
            exp_jitter = round(max(0.5, random.gauss(base_exp, 1.0)), 1)
            perf_score = round(min(5.0, max(2.5, random.gauss(3.8, 0.4))), 2)

            join_days_ago = int(exp_jitter * 365 + random.randint(30, 200))
            joining_date = datetime.utcnow() - timedelta(days=join_days_ago)

            emp = Employee(
                employee_code=f"NW-{dept.code}-{emp_counter}",
                first_name=first_name,
                last_name=last_name,
                gender=gender,
                department_id=dept.id,
                department_name=dept_name,
                role_title=role_title,
                seniority_level=seniority,
                experience_years=exp_jitter,
                performance_score=perf_score,
                joining_date=joining_date,
                is_active=True
            )
            created_employees.append((emp, role_spec))
            emp_counter += 1

    # Bulk insert employees
    db.add_all([e[0] for e in created_employees])
    db.commit()

    for emp, _ in created_employees:
        db.refresh(emp)

    # 4. Generate Multi-Quarter Records (TaskRecords, Compensations, CareerEvents)
    task_records_to_insert = []
    comp_records_to_insert = []
    career_events_to_insert = []

    for emp, (role_title, seniority, base_exp, base_sal) in created_employees:
        dept_name = emp.department_name
        is_female = (emp.gender == "Female")

        # Base compensation calculation
        # Controlling for level/role: Base salaries are within +/- 2.5% market variance
        # Except subtle intentional company policies:
        level_multipliers = {"Junior": 1.0, "Mid": 1.5, "Senior": 2.2, "Lead": 3.2, "Executive": 4.8}
        market_base = base_sal * random.uniform(0.96, 1.04)

        # Baseline quarterly compensation
        for p_key, q_str, year_num in PERIODS:
            # Incremental growth
            quarter_idx = PERIODS.index((p_key, q_str, year_num))
            salary_current = market_base * (1.0 + (quarter_idx * 0.015))
            
            # Bonus
            bonus_pct = random.uniform(0.08, 0.18) if seniority in ["Senior", "Lead", "Executive"] else random.uniform(0.04, 0.10)
            bonus_amt = round(salary_current * bonus_pct, 2)
            inc_pct = round(random.uniform(5.0, 11.0), 2) if q_str == "Q1" else 0.0

            comp = Compensation(
                employee_id=emp.id,
                base_salary=round(salary_current, 2),
                bonus=bonus_amt,
                increment_pct=inc_pct,
                total_comp=round(salary_current + bonus_amt, 2),
                quarter=q_str,
                year=year_num,
                period_key=p_key,
                effective_date=datetime(year_num, 1 if q_str=="Q1" else (4 if q_str=="Q2" else (7 if q_str=="Q3" else 10)), 1)
            )
            comp_records_to_insert.append(comp)

            # Task allocation distributions for this employee in this quarter
            # Hours allocated standard baseline ~40-44 hrs/week -> ~480-540 hrs/quarter
            base_quarter_hours = random.uniform(490.0, 530.0)

            # --- KEY STORY LOGIC ---
            # In SALES department:
            # Persistent intentional disparity:
            # Female Account Executives & SDRs receive ~61% Administrative / Coordination tasks vs ~39% for Male
            # Strategic & Client-Facing high-visibility tasks: Female ~18% vs Male ~34%
            if dept_name == "Sales":
                if is_female:
                    admin_share = random.uniform(0.38, 0.46)
                    coord_share = random.uniform(0.18, 0.24)
                    strategic_share = random.uniform(0.12, 0.18)
                    client_share = random.uniform(0.14, 0.20)
                    lead_share = random.uniform(0.02, 0.06)
                else:
                    admin_share = random.uniform(0.18, 0.24)
                    coord_share = random.uniform(0.12, 0.18)
                    strategic_share = random.uniform(0.28, 0.38)
                    client_share = random.uniform(0.24, 0.32)
                    lead_share = random.uniform(0.06, 0.12)
            elif dept_name == "Operations":
                # Operations has slight coordination variation, moderate signal
                if is_female:
                    admin_share = random.uniform(0.28, 0.35)
                    coord_share = random.uniform(0.30, 0.38)
                    strategic_share = random.uniform(0.12, 0.18)
                    client_share = random.uniform(0.10, 0.16)
                    lead_share = random.uniform(0.04, 0.08)
                else:
                    admin_share = random.uniform(0.24, 0.30)
                    coord_share = random.uniform(0.22, 0.28)
                    strategic_share = random.uniform(0.18, 0.25)
                    client_share = random.uniform(0.14, 0.20)
                    lead_share = random.uniform(0.08, 0.14)
            else:
                # IT, Finance, HR: Balanced task allocation with natural stochastic variation
                admin_share = random.uniform(0.18, 0.25)
                coord_share = random.uniform(0.15, 0.22)
                strategic_share = random.uniform(0.20, 0.28)
                client_share = random.uniform(0.15, 0.24)
                lead_share = random.uniform(0.08, 0.14)

            # Normalize shares
            tot = admin_share + coord_share + strategic_share + client_share + lead_share
            admin_share /= tot
            coord_share /= tot
            strategic_share /= tot
            client_share /= tot
            lead_share /= tot

            tasks_specs = [
                ("Admin Support & Pipeline Hygiene", "administrative", admin_share * base_quarter_hours, "internal_ops", False),
                ("Cross-Team Scheduling & Coordination", "coordination", coord_share * base_quarter_hours, "internal_ops", False),
                ("Key Account Strategy & Pitches", "strategic", strategic_share * base_quarter_hours, "client_core", True),
                ("Client Demos & Customer Engagement", "client-facing", client_share * base_quarter_hours, "client_core", True),
                ("Quarterly Initiative Leadership", "leadership", lead_share * base_quarter_hours, "innovation", True),
            ]

            for t_name, t_cat, t_hrs, p_type, is_hi_vis in tasks_specs:
                tr = TaskRecord(
                    employee_id=emp.id,
                    task_name=t_name,
                    task_category=t_cat,
                    hours_allocated=round(t_hrs, 1),
                    quarter=q_str,
                    year=year_num,
                    period_key=p_key,
                    project_type=p_type,
                    is_high_visibility=is_hi_vis,
                    date=datetime(year_num, 1 if q_str=="Q1" else (4 if q_str=="Q2" else (7 if q_str=="Q3" else 10)), 15)
                )
                task_records_to_insert.append(tr)

        # Career promotions across timeline
        # In Sales: Promotion rate disparity: Male rate ~26.7% vs Female ~18.4% (persistent across quarters)
        # In IT/Finance/HR: Parity rates ~20-22%
        for p_key, q_str, year_num in PERIODS:
            if seniority in ["Junior", "Mid", "Senior"]:
                if dept_name == "Sales":
                    promo_chance = 0.032 if is_female else 0.082  # Cumulative rate gap over 4 quarters is ~8.3 pp
                else:
                    promo_chance = 0.055  # ~22% annual rate across all genders

                if random.random() < promo_chance:
                    next_level = "Mid" if seniority == "Junior" else ("Senior" if seniority == "Mid" else "Lead")
                    ce = CareerEvent(
                        employee_id=emp.id,
                        event_type="promotion",
                        from_level=seniority,
                        to_level=next_level,
                        quarter=q_str,
                        year=year_num,
                        period_key=p_key,
                        event_date=datetime(year_num, 3 if q_str=="Q1" else (6 if q_str=="Q2" else (9 if q_str=="Q3" else 12)), 20)
                    )
                    career_events_to_insert.append(ce)

    # Batch insert sub-tables
    db.bulk_save_objects(comp_records_to_insert)
    db.bulk_save_objects(task_records_to_insert)
    db.bulk_save_objects(career_events_to_insert)
    db.commit()

    return {
        "status": "success",
        "employees_count": len(created_employees),
        "departments_count": len(DEPARTMENT_SPECS),
        "task_records_count": len(task_records_to_insert),
        "compensation_records_count": len(comp_records_to_insert),
        "career_events_count": len(career_events_to_insert),
        "periods": [p[0] for p in PERIODS]
    }
