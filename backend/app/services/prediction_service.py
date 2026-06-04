import pandas as pd

from app.services.model_loader import MODELS


def predict_single(
    model_name: str,
    features: dict
):

    model = MODELS[model_name]

    df = pd.DataFrame([features])

    prediction = int(
        model.predict(df)[0]
    )

    probability = None

    if hasattr(model, "predict_proba"):
        probability = float(
            model.predict_proba(df)[0][1]
        )

    return {
        "prediction": prediction,
        "probability": probability
    }


def predict_all(
    features: dict
):

    results = {}

    for model_name in MODELS:

        results[model_name] = predict_single(
            model_name,
            features
        )

    return results