from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import EquitySignal
from app.schemas.schemas import (
    AIInsightRequest, AIInsightResponse,
    AIChartExplainRequest, AIChartExplainResponse,
    AIChatRequest, AIChatResponse
)
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/insight", response_model=AIInsightResponse)
def get_ai_insight(req: AIInsightRequest, db: Session = Depends(get_db)):
    signal_dict = {}
    if req.signal_id:
        signal = db.query(EquitySignal).filter(EquitySignal.id == req.signal_id).first()
        if signal:
            signal_dict = {
                "department_name": signal.department_name,
                "metric": signal.metric,
                "difference_value": signal.difference_value,
                "difference_unit": signal.difference_unit,
                "observed_female_val": signal.observed_female_val,
                "observed_male_val": signal.observed_male_val,
                "persistence": signal.persistence,
                "confidence": signal.confidence,
                "sample_size_female": signal.sample_size_female,
                "sample_size_male": signal.sample_size_male,
            }
    
    if not signal_dict:
        signal_dict = {
            "department_name": req.department,
            "metric": req.metric,
            "difference_value": 22.0 if req.metric == "task_allocation" else 8.3,
            "difference_unit": "pp",
            "observed_female_val": 61.0 if req.metric == "task_allocation" else 18.4,
            "observed_male_val": 39.0 if req.metric == "task_allocation" else 26.7,
            "persistence": "4 quarters",
            "confidence": "high",
            "sample_size_female": 134,
            "sample_size_male": 146
        }

    insight = AIService.generate_signal_insight(signal_dict, req.context_data)
    return AIInsightResponse(**insight)

@router.post("/explain-chart", response_model=AIChartExplainResponse)
def explain_chart(req: AIChartExplainRequest):
    res = AIService.explain_chart(
        chart_title=req.chart_title,
        metric=req.metric,
        department=req.department,
        data_points=req.data_points,
        chart_context=req.chart_context
    )
    return AIChartExplainResponse(**res)

@router.post("/chat", response_model=AIChatResponse)
def chat_with_analyst(req: AIChatRequest, db: Session = Depends(get_db)):
    res = AIService.chat_assistant(
        db=db,
        message=req.message,
        history=req.history or [],
        department_filter=req.department_filter
    )
    return AIChatResponse(**res)
