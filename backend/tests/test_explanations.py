import pytest
from app.services.explanation_service import (
    FEATURE_METADATA,
    calculate_feature_contributions,
    generate_explanations
)
from app.services.prediction_service import predict_single
from app.services.model_loader import FEATURE_COLUMNS, MODELS

SAMPLE_HIGH_RISK_FEATURES = {
    "Age": 82.0,
    "Gender": 0,
    "Ethnicity": 0,
    "EducationLevel": 0,
    "BMI": 32.5,
    "Smoking": 1,
    "AlcoholConsumption": 14.0,
    "PhysicalActivity": 1.0,
    "DietQuality": 2.0,
    "SleepQuality": 4.5,
    "FamilyHistoryAlzheimers": 1,
    "CardiovascularDisease": 1,
    "Diabetes": 1,
    "Depression": 1,
    "HeadInjury": 1,
    "Hypertension": 1,
    "SystolicBP": 160.0,
    "DiastolicBP": 100.0,
    "CholesterolTotal": 280.0,
    "CholesterolLDL": 175.0,
    "CholesterolHDL": 32.0,
    "CholesterolTriglycerides": 320.0,
    "MMSE": 8.0,
    "FunctionalAssessment": 2.0,
    "MemoryComplaints": 1,
    "BehavioralProblems": 1,
    "ADL": 2.5,
    "Confusion": 1,
    "Disorientation": 1,
    "PersonalityChanges": 1,
    "DifficultyCompletingTasks": 1,
    "Forgetfulness": 1
}

SAMPLE_LOW_RISK_FEATURES = {
    "Age": 62.0,
    "Gender": 1,
    "Ethnicity": 1,
    "EducationLevel": 3,
    "BMI": 22.0,
    "Smoking": 0,
    "AlcoholConsumption": 2.0,
    "PhysicalActivity": 8.5,
    "DietQuality": 9.0,
    "SleepQuality": 8.5,
    "FamilyHistoryAlzheimers": 0,
    "CardiovascularDisease": 0,
    "Diabetes": 0,
    "Depression": 0,
    "HeadInjury": 0,
    "Hypertension": 0,
    "SystolicBP": 115.0,
    "DiastolicBP": 75.0,
    "CholesterolTotal": 175.0,
    "CholesterolLDL": 85.0,
    "CholesterolHDL": 70.0,
    "CholesterolTriglycerides": 110.0,
    "MMSE": 29.0,
    "FunctionalAssessment": 9.5,
    "MemoryComplaints": 0,
    "BehavioralProblems": 0,
    "ADL": 9.0,
    "Confusion": 0,
    "Disorientation": 0,
    "PersonalityChanges": 0,
    "DifficultyCompletingTasks": 0,
    "Forgetfulness": 0
}


def test_feature_metadata_coverage():
    """All 32 feature columns must have complete metadata definitions."""
    for col in FEATURE_COLUMNS:
        assert col in FEATURE_METADATA, f"Missing metadata for {col}"
        meta = FEATURE_METADATA[col]
        assert "label" in meta
        assert "format" in meta
        assert "risk_inc" in meta
        assert "risk_dec" in meta


def test_all_models_produce_explanations():
    """Each supported model must produce ranked natural language explanations."""
    for model_name in MODELS:
        exps = generate_explanations(model_name, SAMPLE_HIGH_RISK_FEATURES, top_k=5)
        assert len(exps) >= 3, f"Expected at least 3 explanations for {model_name}"
        for exp in exps:
            assert "feature" in exp
            assert "label" in exp
            assert "formatted_value" in exp
            assert "contribution" in exp
            assert "impact" in exp
            assert exp["impact"] in ["increased_risk", "lower_risk"]
            assert "statement" in exp
            assert len(exp["statement"]) > 10
            # Ensure medical cautiousness (no deterministic diagnosis)
            assert "you have alzheimer" not in exp["statement"].lower()
            assert "will develop alzheimer" not in exp["statement"].lower()


def test_explanations_are_ranked_by_magnitude():
    """Explanations must be ordered descending by absolute contribution magnitude."""
    for model_name in MODELS:
        exps = generate_explanations(model_name, SAMPLE_HIGH_RISK_FEATURES, top_k=5)
        abs_contribs = [e["abs_contribution"] for e in exps]
        assert abs_contribs == sorted(abs_contribs, reverse=True)


def test_dynamic_explanation_changes_with_patient_values():
    """Changing feature values should dynamically alter the contribution and explanation."""
    # Test for Random Forest
    exp_high = generate_explanations("random_forest", SAMPLE_HIGH_RISK_FEATURES, top_k=5)
    exp_low = generate_explanations("random_forest", SAMPLE_LOW_RISK_FEATURES, top_k=5)

    high_statements = [e["statement"] for e in exp_high]
    low_statements = [e["statement"] for e in exp_low]

    # Statements must differ between very high risk and very low risk patients
    assert high_statements != low_statements


def test_predict_single_returns_explanations():
    """predict_single should return prediction, probability, and structured explanations."""
    result = predict_single("random_forest", SAMPLE_HIGH_RISK_FEATURES)
    assert "prediction" in result
    assert "probability" in result
    assert "explanations" in result
    assert isinstance(result["explanations"], list)
    assert len(result["explanations"]) > 0
