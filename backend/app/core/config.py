import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EquiWatch API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "equiwatch-hackathon-secure-jwt-secret-key-2025")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for demo
    
    # Database (defaults to SQLite for frictionless local setup, PostgreSQL supported)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./equiwatch.db")
    
    # AI API configuration (Gemini / OpenAI optional, fallback engine is always active)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    
    # Seeded Demo Credentials
    DEMO_HR_EMAIL: str = "hr@novaworks.com"
    DEMO_HR_PASSWORD: str = "equiwatch2025"
    DEMO_ADMIN_EMAIL: str = "admin@novaworks.com"
    DEMO_ADMIN_PASSWORD: str = "admin2025"
    DEMO_VIEWER_EMAIL: str = "viewer@novaworks.com"
    DEMO_VIEWER_PASSWORD: str = "viewer2025"
    DEMO_GOV_EMAIL: str = "gov_monitor@policy.org"
    DEMO_GOV_PASSWORD: str = "policy2025"
    
    # Analytical parameters
    MIN_SAMPLE_SIZE_FOR_SIGNAL: int = 8
    CONFIDENCE_ALPHA: float = 0.05
    PERSISTENCE_MIN_QUARTERS: int = 2
    TASK_ALLOCATION_THRESHOLD_PP: float = 12.0
    PROMOTION_GAP_THRESHOLD_PP: float = 6.0
    PAY_GAP_THRESHOLD_PCT: float = 5.0
    WORKLOAD_GAP_THRESHOLD_HOURS: float = 4.0

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
