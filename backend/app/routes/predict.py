from fastapi import APIRouter, HTTPException
import pandas as pd

from app.services.model_loader import MODELS
from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse
)

router = APIRouter()


@router.get("/models")
def get_models():
    return {
        "models": list(MODELS.keys())
    }


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: PredictionRequest):

    if data.model not in MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model: {data.model}"
        )

    model = MODELS[data.model]

    df = pd.DataFrame([
        data.features.model_dump()
    ])

    prediction = int(
        model.predict(df)[0]
    )

    probability = None

    if hasattr(model, "predict_proba"):
        probability = float(
            model.predict_proba(df)[0][1]
        )

    return PredictionResponse(
        model=data.model,
        prediction=prediction,
        probability=probability
    )

@router.post("/predict/all")
def predict_all(data: PredictionRequest):

    df = pd.DataFrame([
        data.features.model_dump()
    ])

    results = {}

    for model_name, model in MODELS.items():

        prediction = int(
            model.predict(df)[0]
        )

        probability = None

        if hasattr(model, "predict_proba"):
            probability = float(
                model.predict_proba(df)[0][1]
            )

        results[model_name] = {
            "prediction": prediction,
            "probability": probability
        }

    return results