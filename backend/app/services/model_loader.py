import os
from pathlib import Path
from joblib import load

# Determine project root robustly across various deployment & execution contexts
def _resolve_project_root() -> Path:
    # 1. Environment variable override
    env_root = os.environ.get("PROJECT_ROOT")
    if env_root:
        candidate = Path(env_root).resolve()
        if (candidate / "ml" / "trained_models").exists():
            return candidate

    # 2. Relative to this file: backend/app/services/model_loader.py -> parents[3] is repo root
    file_anchor = Path(__file__).resolve().parents[3]
    if (file_anchor / "ml" / "trained_models").exists():
        return file_anchor

    # 3. Check all parent directories
    for parent in Path(__file__).resolve().parents:
        if (parent / "ml" / "trained_models").exists():
            return parent

    # 4. Current working directory checks
    cwd = Path.cwd().resolve()
    if (cwd / "ml" / "trained_models").exists():
        return cwd
    if (cwd.parent / "ml" / "trained_models").exists():
        return cwd.parent

    # Default fallback
    return file_anchor

PROJECT_ROOT = _resolve_project_root()
BASE_DIR = str(PROJECT_ROOT)
ML_DIR = PROJECT_ROOT / "ml"
MODELS_DIR = ML_DIR / "trained_models"
DATASETS_DIR = ML_DIR / "datasets"
EVALUATION_DIR = ML_DIR / "evaluation"

if not MODELS_DIR.exists():
    raise FileNotFoundError(f"ML models directory not found at: {MODELS_DIR}")

MODELS = {
    "logistic_regression": load(MODELS_DIR / "logistic_regression.pkl"),
    "random_forest": load(MODELS_DIR / "random_forest.pkl"),
    "xgboost": load(MODELS_DIR / "xgboost.pkl"),
    "svm": load(MODELS_DIR / "svm.pkl")
}

FEATURE_COLUMNS = load(MODELS_DIR / "feature_columns.pkl")

# Support for abbreviated model names
MODEL_NAME_MAP = {
    "logistic": "logistic_regression",
    "rf": "random_forest",
    "xgb": "xgboost"
}

def get_model(model_name: str):
    """Get model by name, supporting both full and abbreviated names."""
    full_name = MODEL_NAME_MAP.get(model_name, model_name)
    if full_name not in MODELS:
        raise KeyError(f"Model '{model_name}' not found. Available models: {list(MODELS.keys())}")
    return MODELS[full_name]