import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predict import router as predict_router
from app.routes.explain import router as explain_router
from app.routes.dataset import router as dataset_router
from app.routes.evaluation import router as evaluation_router

# Load environment variables if available
load_dotenv()

app = FastAPI(
    title="AD_Pred — Alzheimer's Clinical Intelligence API",
    description="Clinical decision-support & machine learning inference engine for Alzheimer's disease risk prediction and SHAP explainability.",
    version="1.0.0"
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# Standard development and production origins
DEFAULT_DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://ad-pred.vercel.app",
]

allowed_origins = list(DEFAULT_DEV_ORIGINS)

frontend_url_env = os.getenv("FRONTEND_URL", "").strip()
if frontend_url_env:
    for url in frontend_url_env.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

allow_all_cors = os.getenv("CORS_ALLOW_ALL", "false").lower() in ("true", "1", "yes")

if allow_all_cors:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_origin_regex=r"https:\/\/.*\.vercel\.app" if os.getenv("ALLOW_VERCEL_PREVIEWS", "true").lower() in ("true", "1", "yes") else None,
    )

# ---------------------------------------------------------------------------
# Router Inclusions
# ---------------------------------------------------------------------------
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


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)