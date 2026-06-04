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

FEATURE_COLUMNS = load(os.path.join(MODELS_DIR, "feature_columns.pkl"))