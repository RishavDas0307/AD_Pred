import pandas as pd

from app.services.model_loader import FEATURE_COLUMNS, MODELS, get_model
from app.services.explanation_service import generate_explanations


def _prepare_input_frame(features: dict) -> pd.DataFrame:
    """Build a single-row frame with exact training column order and numeric types."""
    df = pd.DataFrame([features])
    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    return df.apply(pd.to_numeric, errors="coerce").fillna(0.0)


def predict_single(
    model_name: str,
    features: dict,
    include_explanations: bool = True
):

    model = get_model(model_name)
    df = _prepare_input_frame(features)

    prediction = int(
        model.predict(df)[0]
    )

    probability = None

    if hasattr(model, "predict_proba"):
        probability = float(
            model.predict_proba(df)[0][1]
        )

    explanations = None
    if include_explanations:
        try:
            explanations = generate_explanations(
                model_name=model_name,
                features=features,
                top_k=5
            )
        except Exception:
            explanations = []

    return {
        "prediction": prediction,
        "probability": probability,
        "explanations": explanations
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