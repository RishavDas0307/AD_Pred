import pandas as pd
import shap

from app.services.model_loader import MODELS


def explain_prediction(model_name, features):

    model = MODELS[model_name]

    df = pd.DataFrame([features])

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(df)

    values = shap_values[0, :, 1]

    contributions = {}

    for feature, value in zip(df.columns, values):
        contributions[feature] = float(value)

    sorted_features = sorted(
    contributions.items(),
    key=lambda x: abs(x[1]),
    reverse=True
)

    return {
        "model": model_name,
        "top_features": sorted_features[:10]
    }