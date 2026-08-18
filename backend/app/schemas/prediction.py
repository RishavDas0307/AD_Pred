from pydantic import BaseModel
from typing import Literal

class Features(BaseModel):
    Age: float
    Gender: int
    Ethnicity: int
    EducationLevel: int
    BMI: float
    Smoking: int
    AlcoholConsumption: float
    PhysicalActivity: float
    DietQuality: float
    SleepQuality: float

    FamilyHistoryAlzheimers: int
    CardiovascularDisease: int
    Diabetes: int
    Depression: int
    HeadInjury: int
    Hypertension: int

    SystolicBP: float
    DiastolicBP: float

    CholesterolTotal: float
    CholesterolLDL: float
    CholesterolHDL: float
    CholesterolTriglycerides: float

    MMSE: float
    FunctionalAssessment: float

    MemoryComplaints: int
    BehavioralProblems: int
    ADL: float
    Confusion: int
    Disorientation: int
    PersonalityChanges: int
    DifficultyCompletingTasks: int
    Forgetfulness: int

class ExplanationItem(BaseModel):
    feature: str
    label: str
    value: float | int
    formatted_value: str
    contribution: float
    abs_contribution: float
    impact: Literal["increased_risk", "lower_risk"]
    statement: str

class PredictionResponse(BaseModel):
    model: str
    prediction: int
    probability: float | None = None
    explanations: list[ExplanationItem] | None = None

class PredictionRequest(BaseModel):
    model: Literal[
        "logistic_regression",
        "random_forest",
        "xgboost",
        "svm"
    ]
    features: Features