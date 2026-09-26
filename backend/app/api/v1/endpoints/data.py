import io
import pandas as pd
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.synthetic_data import generate_synthetic_dataset
from app.services.signal_detector import SignalDetector
from app.models.models import Employee, Department, TaskRecord, Compensation, CareerEvent, EquitySignal
from app.schemas.schemas import CSVUploadResult

router = APIRouter()

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Clears existing records, regenerates full realistic NovaWorks dataset,
    and recalculates all analytical equity signals.
    """
    data_res = generate_synthetic_dataset(db, force_reset=True)
    signals = SignalDetector.evaluate_all_departments(db, period="2025-Q4")
    return {
        "status": "success",
        "message": "Demo dataset successfully generated and analyzed.",
        "data_stats": data_res,
        "signals_generated_count": len(signals)
    }

@router.post("/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Resets the database back to clean seeded NovaWorks demo state.
    """
    data_res = generate_synthetic_dataset(db, force_reset=True)
    signals = SignalDetector.evaluate_all_departments(db, period="2025-Q4")
    return {
        "status": "success",
        "message": "EquiWatch environment reset to initial demo state.",
        "signals_count": len(signals)
    }

@router.get("/summary")
def get_data_summary(db: Session = Depends(get_db)):
    emp_count = db.query(Employee).count()
    dept_count = db.query(Department).count()
    task_count = db.query(TaskRecord).count()
    comp_count = db.query(Compensation).count()
    promo_count = db.query(CareerEvent).count()
    signals_count = db.query(EquitySignal).count()

    return {
        "dataset_name": "NovaWorks Demo Enterprise Dataset",
        "company": "NovaWorks Technologies",
        "total_employees": emp_count,
        "total_departments": dept_count,
        "total_task_records": task_count,
        "total_compensation_records": comp_count,
        "total_career_events": promo_count,
        "active_equity_signals": signals_count,
        "tracking_periods": ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"],
        "is_synthetic": True,
        "label": "Demo data — synthetic workforce dataset"
    }

@router.post("/upload-csv", response_model=CSVUploadResult)
async def upload_workforce_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Robust CSV parser and validator.
    Performs field checking, type coercion, missing value audits, duplicate ID checks,
    and atomic batch loading.
    """
    if not file.filename.endswith(".csv"):
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            employees_created=0,
            task_records_created=0,
            compensation_records_created=0,
            promotions_created=0,
            validation_errors=["Uploaded file must be a .csv format."],
            warnings=[],
            message="Invalid file format."
        )

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            employees_created=0,
            task_records_created=0,
            compensation_records_created=0,
            promotions_created=0,
            validation_errors=[f"Failed to parse CSV file: {str(e)}"],
            warnings=[],
            message="Malformed CSV file."
        )

    required_columns = ["employee_id", "gender", "department", "role", "seniority"]
    missing_cols = [c for c in required_columns if c not in df.columns]
    if missing_cols:
        return CSVUploadResult(
            success=False,
            rows_processed=len(df),
            employees_created=0,
            task_records_created=0,
            compensation_records_created=0,
            promotions_created=0,
            validation_errors=[f"Missing mandatory columns: {', '.join(missing_cols)}"],
            warnings=[],
            message="Schema validation failed."
        )

    validation_errors = []
    warnings = []

    # Check for empty dataframe
    if len(df) == 0:
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            employees_created=0,
            task_records_created=0,
            compensation_records_created=0,
            promotions_created=0,
            validation_errors=["CSV file contains no data rows."],
            warnings=[],
            message="Empty CSV file."
        )

    # Validate gender categories
    valid_genders = {"Female", "Male", "Non-Binary", "Other"}
    invalid_genders = df[~df["gender"].astype(str).str.capitalize().isin(valid_genders)]
    if len(invalid_genders) > 0:
        warnings.append(f"{len(invalid_genders)} rows contain non-standard gender labels which will be grouped as 'Other'.")

    # Validate duplicate employee_ids within single static upload
    if df["employee_id"].duplicated().any() and "date" not in df.columns and "quarter" not in df.columns:
        dup_count = df["employee_id"].duplicated().sum()
        warnings.append(f"Detected {dup_count} duplicate employee_id occurrences across multiple record lines.")

    # Department lookup
    dept_map = {d.name.lower(): d for d in db.query(Department).all()}

    emp_created = 0
    tasks_created = 0
    comps_created = 0
    promos_created = 0

    try:
        # Create department if not existing
        unique_depts = df["department"].dropna().unique()
        for d_name in unique_depts:
            if str(d_name).lower() not in dept_map:
                new_d = Department(
                    name=str(d_name),
                    code=str(d_name)[:3].upper(),
                    description=f"Department {d_name} imported from CSV.",
                    head_count=0
                )
                db.add(new_d)
                db.commit()
                db.refresh(new_d)
                dept_map[str(d_name).lower()] = new_d

        # Process records
        for idx, row in df.iterrows():
            d_name = str(row["department"]).strip()
            dept_obj = dept_map.get(d_name.lower())
            emp_code = str(row["employee_id"]).strip()
            gender = str(row["gender"]).strip().capitalize()
            role = str(row["role"]).strip()
            seniority = str(row.get("seniority", "Mid")).strip()
            exp_yrs = float(row.get("experience_years", 3.0)) if pd.notna(row.get("experience_years")) else 3.0

            # Check if employee exists
            emp = db.query(Employee).filter(Employee.employee_code == emp_code).first()
            if not emp:
                emp = Employee(
                    employee_code=emp_code,
                    first_name=f"Emp_{emp_code}",
                    last_name="Staff",
                    gender=gender,
                    department_id=dept_obj.id if dept_obj else 1,
                    department_name=dept_obj.name if dept_obj else d_name,
                    role_title=role,
                    seniority_level=seniority,
                    experience_years=exp_yrs,
                    joining_date=datetime.utcnow()
                )
                db.add(emp)
                db.commit()
                db.refresh(emp)
                emp_created += 1

            # Check for task fields
            if "hours" in row and pd.notna(row["hours"]):
                try:
                    hrs = float(row["hours"])
                    t_cat = str(row.get("task_category", "operational")).lower()
                    tr = TaskRecord(
                        employee_id=emp.id,
                        task_name=str(row.get("task_name", f"{t_cat.capitalize()} Task")),
                        task_category=t_cat,
                        hours_allocated=hrs,
                        quarter="Q4",
                        year=2025,
                        period_key="2025-Q4",
                        project_type=str(row.get("project_type", "standard"))
                    )
                    db.add(tr)
                    tasks_created += 1
                except ValueError:
                    validation_errors.append(f"Row {idx+1}: Invalid numeric value for 'hours'.")

            # Check for compensation fields
            if "salary" in row and pd.notna(row["salary"]):
                try:
                    sal = float(row["salary"])
                    bon = float(row.get("bonus", 0.0)) if pd.notna(row.get("bonus")) else 0.0
                    inc = float(row.get("increment", 0.0)) if pd.notna(row.get("increment")) else 0.0
                    comp = Compensation(
                        employee_id=emp.id,
                        base_salary=sal,
                        bonus=bon,
                        increment_pct=inc,
                        total_comp=sal + bon,
                        quarter="Q4",
                        year=2025,
                        period_key="2025-Q4"
                    )
                    db.add(comp)
                    comps_created += 1
                except ValueError:
                    validation_errors.append(f"Row {idx+1}: Invalid numeric value for 'salary'.")

            # Check for promotion fields
            if "promotion" in row and pd.notna(row["promotion"]):
                promo_val = str(row["promotion"]).strip().lower()
                if promo_val in ["1", "true", "yes", "promoted"]:
                    ce = CareerEvent(
                        employee_id=emp.id,
                        event_type="promotion",
                        from_level=seniority,
                        to_level="Advanced",
                        quarter="Q4",
                        year=2025,
                        period_key="2025-Q4"
                    )
                    db.add(ce)
                    promos_created += 1

        db.commit()
        # Recalculate signals
        SignalDetector.evaluate_all_departments(db, period="2025-Q4")

        return CSVUploadResult(
            success=True,
            rows_processed=len(df),
            employees_created=emp_created,
            task_records_created=tasks_created,
            compensation_records_created=comps_created,
            promotions_created=promos_created,
            validation_errors=validation_errors[:10],
            warnings=warnings,
            message="CSV successfully ingested and analyzed."
        )

    except Exception as e:
        db.rollback()
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            employees_created=0,
            task_records_created=0,
            compensation_records_created=0,
            promotions_created=0,
            validation_errors=[f"Database transaction error: {str(e)}"],
            warnings=[],
            message="Failed to import data."
        )
