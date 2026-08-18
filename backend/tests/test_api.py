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
    assert res.json()["status"] == "healthy"


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


def test_predict_all_endpoint():
    payload = {
        "model": "random_forest",
        "features": SAMPLE_FEATURES
    }
    res = client.post("/predict/all", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "random_forest" in data
    assert "xgboost" in data
    assert "svm" in data
    assert "logistic_regression" in data


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


def test_evaluation_metrics_endpoint():
    res = client.get("/evaluation/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "benchmarks" in data
    assert len(data["benchmarks"]) == 4
    assert "models" in data
    assert "random_forest" in data["models"]
    assert "xgboost" in data["models"]
    assert "confusion_matrix" in data["models"]["random_forest"]


def test_dataset_summary_endpoint():
    res = client.get("/dataset/summary")
    assert res.status_code == 200
    data = res.json()
    assert "overview" in data
    assert data["overview"]["total_records"] == 2149
    assert data["overview"]["total_features"] == 32
    assert "distributions" in data
    assert "mean_comparisons" in data
    assert "correlations" in data


def test_dataset_features_endpoint():
    res = client.get("/dataset/features")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 32
    assert len(data["features"]) == 32
