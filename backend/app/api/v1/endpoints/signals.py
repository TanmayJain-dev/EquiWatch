from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import EquitySignal
from app.schemas.schemas import EquitySignalOut
from pydantic import BaseModel

router = APIRouter()

class SignalUpdate(BaseModel):
    status: Optional[str] = None # active, investigating, resolved, acknowledged
    notes: Optional[str] = None

@router.get("", response_model=List[EquitySignalOut])
def list_signals(
    department: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    metric: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(EquitySignal)
    if department:
        query = query.filter(EquitySignal.department_name.ilike(department))
    if severity:
        query = query.filter(EquitySignal.severity == severity)
    if metric:
        query = query.filter(EquitySignal.metric == metric)
    if status:
        query = query.filter(EquitySignal.status == status)
    
    return query.order_by(EquitySignal.id.asc()).all()

@router.get("/{id}", response_model=EquitySignalOut)
def get_signal_by_id(id: int, db: Session = Depends(get_db)):
    signal = db.query(EquitySignal).filter(EquitySignal.id == id).first()
    if not signal:
        raise HTTPException(status_code=404, detail="Equity signal not found.")
    return signal

@router.patch("/{id}", response_model=EquitySignalOut)
def update_signal(id: int, update_data: SignalUpdate, db: Session = Depends(get_db)):
    signal = db.query(EquitySignal).filter(EquitySignal.id == id).first()
    if not signal:
        raise HTTPException(status_code=404, detail="Equity signal not found.")
    
    if update_data.status:
        signal.status = update_data.status
    if update_data.notes is not None:
        signal.notes = update_data.notes

    db.commit()
    db.refresh(signal)
    return signal
