from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Report
from app.schemas.schemas import ReportCreate, ReportOut
from app.services.report_service import ReportService
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ReportOut])
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.id.desc()).all()

@router.get("/{id}", response_model=ReportOut)
def get_report(id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return report

@router.post("", response_model=ReportOut)
def generate_report(req: ReportCreate, db: Session = Depends(get_db)):
    report = ReportService.generate_department_report(
        db=db,
        department_name=req.department_name,
        period=req.period,
        author_email="hr@novaworks.com"
    )
    return report
