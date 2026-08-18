from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predict import router as predict_router
from app.routes.explain import router as explain_router
from app.routes.dataset import router as dataset_router
from app.routes.evaluation import router as evaluation_router

app = FastAPI(
    title="AD_Pred — Alzheimer's Clinical Intelligence API",
    description="Clinical decision-support & machine learning inference engine for Alzheimer's disease risk prediction and SHAP explainability.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev & testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(explain_router)
app.include_router(dataset_router)
app.include_router(evaluation_router)


@app.get("/")
def home():
    return {
        "message": "AD_Pred Clinical Intelligence API Active",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": 4,
        "dataset_connected": True
    }