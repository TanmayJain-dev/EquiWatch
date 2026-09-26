from fastapi import APIRouter
from app.schemas.schemas import BenchmarkValidationResult
from app.services.validation_service import ValidationService

router = APIRouter()

@router.get("/benchmark", response_model=BenchmarkValidationResult)
def run_benchmark_validation():
    """
    Executes internal empirical test harness measuring precision, recall, and false alert rate
    over 100 calibrated synthetic scenarios.
    """
    return ValidationService.run_benchmark_validation(num_test_cases=100)
