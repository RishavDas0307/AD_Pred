from fastapi import FastAPI

from app.routes.predict import router

app = FastAPI(
    title="Alzheimer Prediction API"
)

app.include_router(router)