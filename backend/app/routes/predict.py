from fastapi import APIRouter
from app.services.model_loader import MODELS

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse
)

from app.services.prediction_service import (
    predict_single,
    predict_all
)

router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: PredictionRequest):

    result = predict_single(
        data.model,
        data.features.model_dump()
    )

    return PredictionResponse(
        model=data.model,
        prediction=result["prediction"],
        probability=result["probability"]
    )


@router.post("/predict/all")
def predict_every_model(
    data: PredictionRequest
):

    return predict_all(
        data.features.model_dump()
    )

@router.get("/models")
def get_models():
    return {
        "models": list(MODELS.keys())
    }

