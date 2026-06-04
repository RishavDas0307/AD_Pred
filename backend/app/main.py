from fastapi import FastAPI

from app.routes.predict import router
from app.routes.explain import router as explain_router



app = FastAPI(
    title="Alzheimer Disease Prediction API",
    version="1.0.0"
)

app.include_router(router)
app.include_router(explain_router)

@app.get("/")
def home():
    return {
        "message": "Alzheimer Prediction API Running"
    }

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }