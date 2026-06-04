from fastapi import FastAPI

from app.routes.predict import router

app = FastAPI(
    title="Alzheimer Disease Prediction API",
    version="1.0.0"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Alzheimer Prediction API Running"
    }