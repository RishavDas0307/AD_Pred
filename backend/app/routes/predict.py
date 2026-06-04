from fastapi import APIRouter
import pandas as pd

from app.services.model_loader import (
    MODELS,
    FEATURE_COLUMNS
)

router = APIRouter()

@router.post("/predict")
def predict(data: dict):

    model_name = data["model"]
    features = data["features"]

    row = {}

    for col in FEATURE_COLUMNS:
        row[col] = features.get(col, 0)

    df = pd.DataFrame([row])

    model = MODELS[model_name]

    prediction = int(model.predict(df)[0])

    probability = None

    if hasattr(model, "predict_proba"):
        probability = float(
            model.predict_proba(df)[0][1]
        )

    return {
        "model": model_name,
        "prediction": prediction,
        "probability": probability
    }

@router.get("/models")
def get_models():

    return {
        "models": [
            "logistic",
            "random_forest",
            "xgboost",
            "svm"
        ]
    }