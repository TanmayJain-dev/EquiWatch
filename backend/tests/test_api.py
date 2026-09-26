from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "hr@novaworks.com",
        "password": "equiwatch2025"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "hr_admin"

def test_dashboard_summary():
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "NovaWorks"
    assert data["total_employees"] > 0
    assert len(data["department_overview"]) == 5

def test_department_overview():
    response = client.get("/api/v1/departments/Sales/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["department"]["name"] == "Sales"
    assert "pillar_summary" in data

def test_signals_list():
    response = client.get("/api/v1/signals")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_ai_chart_explain():
    response = client.post("/api/v1/ai/explain-chart", json={
        "chart_title": "Promotion Rate by Quarter",
        "metric": "promotion_rate",
        "department": "Sales",
        "data_points": [{"quarter": "2024-Q1", "gap": 3.2}, {"quarter": "2024-Q4", "gap": 8.3}]
    })
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "key_observations" in data

def test_validation_benchmark():
    response = client.get("/api/v1/validation/benchmark")
    assert response.status_code == 200
    data = response.json()
    assert data["test_cases_total"] == 100
    assert "precision_pct" in data
    assert "recall_pct" in data
