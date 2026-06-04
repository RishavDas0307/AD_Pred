import os
from joblib import load

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "ml", "trained_models")

MODELS = {
    "logistic_regression": load(os.path.join(MODELS_DIR, "logistic_regression.pkl")),
    "random_forest": load(os.path.join(MODELS_DIR, "random_forest.pkl")),
    "xgboost": load(os.path.join(MODELS_DIR, "xgboost.pkl")),
    "svm": load(os.path.join(MODELS_DIR, "svm.pkl"))
}

# Support for abbreviated model names
MODEL_NAME_MAP = {
    "logistic": "logistic_regression",
    "rf": "random_forest",
    "xgb": "xgboost"
}

def get_model(model_name: str):
    """Get model by name, supporting both full and abbreviated names."""
    # Map abbreviated names to full names
    full_name = MODEL_NAME_MAP.get(model_name, model_name)
    return MODELS[full_name]

FEATURE_COLUMNS = load(os.path.join(MODELS_DIR, "feature_columns.pkl"))