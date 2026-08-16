from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_FEATURES = {
    "Age": 72.0,
    "Gender": 0,
    "Ethnicity": 0,
    "EducationLevel": 1,
    "BMI": 26.5,
    "Smoking": 0,
    "AlcoholConsumption": 5.0,
    "PhysicalActivity": 3.0,
    "DietQuality": 6.0,
    "SleepQuality": 7.0,
    "FamilyHistoryAlzheimers": 1,
    "CardiovascularDisease": 0,
    "Diabetes": 0,
    "Depression": 0,
    "HeadInjury": 0,
    "Hypertension": 0,
    "SystolicBP": 130.0,
    "DiastolicBP": 85.0,
    "CholesterolTotal": 210.0,
    "CholesterolLDL": 130.0,
    "CholesterolHDL": 50.0,
    "CholesterolTriglycerides": 160.0,
    "MMSE": 16.0,
    "FunctionalAssessment": 4.5,
    "MemoryComplaints": 1,
    "BehavioralProblems": 0,
    "ADL": 4.0,
    "Confusion": 0,
    "Disorientation": 0,
    "PersonalityChanges": 0,
    "DifficultyCompletingTasks": 0,
    "Forgetfulness": 1
}


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}


def test_predict_endpoint_with_explanations():
    payload = {
        "model": "random_forest",
        "features": SAMPLE_FEATURES
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["model"] == "random_forest"
    assert "prediction" in data
    assert "probability" in data
    assert "explanations" in data
    assert len(data["explanations"]) > 0
    first_exp = data["explanations"][0]
    assert "feature" in first_exp
    assert "label" in first_exp
    assert "statement" in first_exp
    assert "impact" in first_exp


def test_explain_endpoint_structure():
    payload = {
        "model": "xgboost",
        "features": SAMPLE_FEATURES
    }
    res = client.post("/explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["model"] == "xgboost"
    assert "top_features" in data
    assert "explanations" in data
    assert len(data["explanations"]) > 0
