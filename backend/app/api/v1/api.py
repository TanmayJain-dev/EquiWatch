from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, dashboard, departments, analytics, signals, ai, data, reports, government, validation
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(departments.router, prefix="/departments", tags=["Departments"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(signals.router, prefix="/signals", tags=["Equity Signals"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Analyst"])
api_router.include_router(data.router, prefix="/data", tags=["Data Management"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(government.router, prefix="/government", tags=["Government Preview"])
api_router.include_router(validation.router, prefix="/validation", tags=["Validation Benchmark"])
