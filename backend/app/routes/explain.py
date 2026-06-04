from fastapi import APIRouter

from app.schemas.prediction import (
    PredictionRequest
)

from app.services.shap_service import (
    explain_prediction
)

router = APIRouter()


@router.post("/explain")
def explain(
    data: PredictionRequest
):

    return explain_prediction(
        data.model,
        data.features.model_dump()
    )