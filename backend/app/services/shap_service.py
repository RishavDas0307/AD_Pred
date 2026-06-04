import pandas as pd
import numpy as np
import shap
from app.services.model_loader import MODELS

TREE_MODELS = {"random_forest", "xgboost"}

def explain_prediction(model_name, features):
    model = MODELS[model_name]
    df = pd.DataFrame([features])

    if model_name not in TREE_MODELS:
        return {"model": model_name, "top_features": []}

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df)
    sv = np.array(shap_values)

    if sv.ndim == 3 and sv.shape[0] == 2:
        # Old SHAP: (2, n_samples, n_features) — take class 1
        values = sv[1][0]
    elif sv.ndim == 3 and sv.shape[0] == 1:
        # New SHAP RF: (1, n_samples, n_features)
        values = sv[0][0]
    elif sv.ndim == 2:
        # XGBoost: (n_samples, n_features)
        values = sv[0]
    elif isinstance(shap_values, list):
        # List format — take last class
        values = np.array(shap_values[-1][0])
    else:
        values = sv.flatten()

    contributions = {}
    for feature, value in zip(df.columns, values):
        contributions[feature] = float(value)

    sorted_features = sorted(
        contributions.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    return {"model": model_name, "top_features": sorted_features[:10]}