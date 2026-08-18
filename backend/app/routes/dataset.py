import os
import pandas as pd
import numpy as np
from fastapi import APIRouter
from app.services.model_loader import BASE_DIR, DATASETS_DIR, FEATURE_COLUMNS
from app.services.explanation_service import FEATURE_METADATA


router = APIRouter(prefix="/dataset", tags=["dataset"])

_CACHED_DATASET_SUMMARY = None

FEATURE_DEFINITIONS = [
    # Demographics
    {
        "name": "Age",
        "label": "Age",
        "category": "Demographics",
        "type": "numeric",
        "unit": "years",
        "min": 18,
        "max": 100,
        "step": 1,
        "default": 65,
        "description": "Patient age in years at the time of clinical evaluation (expanded universal range 18-100)."
    },
    {
        "name": "Gender",
        "label": "Gender",
        "category": "Demographics",
        "type": "categorical",
        "options": [{"value": 0, "label": "Male"}, {"value": 1, "label": "Female"}],
        "default": 0,
        "description": "Biological sex of the participant (0: Male, 1: Female)."
    },
    {
        "name": "Ethnicity",
        "label": "Ethnicity",
        "category": "Demographics",
        "type": "categorical",
        "options": [
            {"value": 0, "label": "Caucasian"},
            {"value": 1, "label": "African American"},
            {"value": 2, "label": "Asian"},
            {"value": 3, "label": "Other"}
        ],
        "default": 0,
        "description": "Self-reported ethnic background of the participant."
    },
    {
        "name": "EducationLevel",
        "label": "Education Level",
        "category": "Demographics",
        "type": "categorical",
        "options": [
            {"value": 0, "label": "None / Primary"},
            {"value": 1, "label": "High School"},
            {"value": 2, "label": "Bachelor's Degree"},
            {"value": 3, "label": "Higher Education"}
        ],
        "default": 1,
        "description": "Highest formal educational attainment completed."
    },
    {
        "name": "BMI",
        "label": "Body Mass Index (BMI)",
        "category": "Demographics",
        "type": "numeric",
        "unit": "kg/m²",
        "min": 12.0,
        "max": 55.0,
        "step": 0.1,
        "default": 24.5,
        "description": "Ratio of weight in kilograms divided by height in meters squared (universal range 12-55)."
    },

    # Lifestyle
    {
        "name": "Smoking",
        "label": "Smoking Status",
        "category": "Lifestyle",
        "type": "binary",
        "options": [{"value": 0, "label": "No / Non-smoker"}, {"value": 1, "label": "Yes / Active smoker"}],
        "default": 0,
        "description": "Current active tobacco smoking status."
    },
    {
        "name": "AlcoholConsumption",
        "label": "Weekly Alcohol Intake",
        "category": "Lifestyle",
        "type": "numeric",
        "unit": "units/week",
        "min": 0.0,
        "max": 40.0,
        "step": 0.5,
        "default": 2.0,
        "description": "Average alcohol intake in standard units per week (0-40)."
    },
    {
        "name": "PhysicalActivity",
        "label": "Physical Activity Level",
        "category": "Lifestyle",
        "type": "numeric",
        "unit": "hrs/week",
        "min": 0.0,
        "max": 25.0,
        "step": 0.5,
        "default": 4.5,
        "description": "Estimated weekly moderate-to-vigorous physical exercise hours (0-25)."
    },
    {
        "name": "DietQuality",
        "label": "Diet Quality Score",
        "category": "Lifestyle",
        "type": "numeric",
        "unit": "score (0-10)",
        "min": 0.0,
        "max": 10.0,
        "step": 0.1,
        "default": 6.0,
        "description": "Adherence score to balanced nutritional patterns (0=poor, 10=optimal)."
    },
    {
        "name": "SleepQuality",
        "label": "Sleep Quality Score",
        "category": "Lifestyle",
        "type": "numeric",
        "unit": "score (1-10)",
        "min": 1.0,
        "max": 10.0,
        "step": 0.1,
        "default": 7.0,
        "description": "Assessment of self-reported restorative sleep quality (1=poor, 10=excellent)."
    },

    # Medical History
    {
        "name": "FamilyHistoryAlzheimers",
        "label": "Family History of Alzheimer's",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "No History"}, {"value": 1, "label": "Positive Family History"}],
        "default": 0,
        "description": "Documented first-degree familial history of diagnosed Alzheimer's Disease."
    },
    {
        "name": "CardiovascularDisease",
        "label": "Cardiovascular Disease",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "Absent"}, {"value": 1, "label": "Diagnosed"}],
        "default": 0,
        "description": "History of cardiovascular conditions (coronary artery disease, heart failure)."
    },
    {
        "name": "Diabetes",
        "label": "Diabetes Mellitus",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "Absent"}, {"value": 1, "label": "Diagnosed"}],
        "default": 0,
        "description": "Clinical diagnosis of type 1 or type 2 diabetes mellitus."
    },
    {
        "name": "Depression",
        "label": "Clinical Depression History",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "Absent"}, {"value": 1, "label": "Documented History"}],
        "default": 0,
        "description": "Documented episodes of clinical depression or mood disorders."
    },
    {
        "name": "HeadInjury",
        "label": "History of Head Trauma",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "None"}, {"value": 1, "label": "Prior Head Trauma"}],
        "default": 0,
        "description": "Past traumatic brain injury or loss of consciousness."
    },
    {
        "name": "Hypertension",
        "label": "Documented Hypertension",
        "category": "Medical History",
        "type": "binary",
        "options": [{"value": 0, "label": "Normotensive"}, {"value": 1, "label": "Hypertensive"}],
        "default": 0,
        "description": "Documented clinical diagnosis of high blood pressure."
    },

    # Clinical Measurements
    {
        "name": "SystolicBP",
        "label": "Systolic Blood Pressure",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mmHg",
        "min": 70,
        "max": 220,
        "step": 1,
        "default": 120,
        "description": "Systolic blood pressure measured during rest (universal range 70-220 mmHg)."
    },
    {
        "name": "DiastolicBP",
        "label": "Diastolic Blood Pressure",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mmHg",
        "min": 40,
        "max": 140,
        "step": 1,
        "default": 80,
        "description": "Diastolic blood pressure measured during rest (universal range 40-140 mmHg)."
    },
    {
        "name": "CholesterolTotal",
        "label": "Total Serum Cholesterol",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mg/dL",
        "min": 100.0,
        "max": 450.0,
        "step": 1.0,
        "default": 200.0,
        "description": "Total serum blood cholesterol concentration (universal range 100-450 mg/dL)."
    },
    {
        "name": "CholesterolLDL",
        "label": "Low-Density Lipoprotein (LDL)",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mg/dL",
        "min": 30.0,
        "max": 300.0,
        "step": 1.0,
        "default": 110.0,
        "description": "Serum LDL ('bad') cholesterol concentration (universal range 30-300 mg/dL)."
    },
    {
        "name": "CholesterolHDL",
        "label": "High-Density Lipoprotein (HDL)",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mg/dL",
        "min": 10.0,
        "max": 140.0,
        "step": 1.0,
        "default": 55.0,
        "description": "Serum HDL ('good') protective cholesterol concentration (universal range 10-140 mg/dL)."
    },
    {
        "name": "CholesterolTriglycerides",
        "label": "Serum Triglycerides",
        "category": "Clinical Measurements",
        "type": "numeric",
        "unit": "mg/dL",
        "min": 30.0,
        "max": 600.0,
        "step": 1.0,
        "default": 150.0,
        "description": "Serum triglyceride concentration (universal range 30-600 mg/dL)."
    },

    # Cognitive & Symptoms
    {
        "name": "MMSE",
        "label": "Mini-Mental State Exam (MMSE)",
        "category": "Cognitive & Symptoms",
        "type": "numeric",
        "unit": "score (0-30)",
        "min": 0.0,
        "max": 30.0,
        "step": 0.5,
        "default": 24.0,
        "description": "Standardized 30-point cognitive screening tool evaluating orientation, recall, attention, and language (scores <24 often indicate cognitive impairment)."
    },
    {
        "name": "FunctionalAssessment",
        "label": "Functional Assessment",
        "category": "Cognitive & Symptoms",
        "type": "numeric",
        "unit": "score (0-10)",
        "min": 0.0,
        "max": 10.0,
        "step": 0.1,
        "default": 6.5,
        "description": "Clinical rating of autonomy and capacity in everyday tasks (0=severely impaired, 10=fully independent)."
    },
    {
        "name": "ADL",
        "label": "Activities of Daily Living (ADL)",
        "category": "Cognitive & Symptoms",
        "type": "numeric",
        "unit": "score (0-10)",
        "min": 0.0,
        "max": 10.0,
        "step": 0.1,
        "default": 7.0,
        "description": "Index score assessing basic self-care and functional autonomy (0=dependent, 10=completely independent)."
    },
    {
        "name": "MemoryComplaints",
        "label": "Reported Memory Complaints",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "No Complaints"}, {"value": 1, "label": "Reported by Patient/Family"}],
        "default": 0,
        "description": "Subjective memory complaints noted by the patient or caregiver."
    },
    {
        "name": "BehavioralProblems",
        "label": "Behavioral & Neuropsychiatric Symptoms",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "None Observed"}, {"value": 1, "label": "Reported / Observed"}],
        "default": 0,
        "description": "Presence of irritability, agitation, anxiety, or apathy."
    },
    {
        "name": "Confusion",
        "label": "Episodes of Confusion",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "None"}, {"value": 1, "label": "Reported Episodes"}],
        "default": 0,
        "description": "Episodes of mental confusion or difficulty with situational comprehension."
    },
    {
        "name": "Disorientation",
        "label": "Spatial / Temporal Disorientation",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "None"}, {"value": 1, "label": "Reported Disorientation"}],
        "default": 0,
        "description": "Difficulty knowing current time, place, or spatial surroundings."
    },
    {
        "name": "PersonalityChanges",
        "label": "Personality & Mood Alterations",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "None"}, {"value": 1, "label": "Reported Alterations"}],
        "default": 0,
        "description": "Marked shifts in social behavior, personality, or emotional response."
    },
    {
        "name": "DifficultyCompletingTasks",
        "label": "Difficulty Completing Everyday Tasks",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "No Difficulty"}, {"value": 1, "label": "Reported Difficulty"}],
        "default": 0,
        "description": "Noticeable struggle handling complex tasks like managing bills or medication."
    },
    {
        "name": "Forgetfulness",
        "label": "Persistent Forgetfulness",
        "category": "Cognitive & Symptoms",
        "type": "binary",
        "options": [{"value": 0, "label": "Normal for Age"}, {"value": 1, "label": "Frequent / Disruptive"}],
        "default": 0,
        "description": "Frequent repetition of questions or forgetting recently learned information."
    }
]


def _build_dataset_summary():
    global _CACHED_DATASET_SUMMARY
    if _CACHED_DATASET_SUMMARY is not None:
        return _CACHED_DATASET_SUMMARY

    data_path = DATASETS_DIR / "alzheimers_disease_data.csv"
    if not data_path.exists():
        return {"error": "Dataset file not found"}

    df = pd.read_csv(data_path)

    total_records = len(df)
    diagnosis_counts = df["Diagnosis"].value_counts().to_dict()
    non_ad_count = int(diagnosis_counts.get(0, 0))
    ad_count = int(diagnosis_counts.get(1, 0))

    # Calculate histograms for key numerical features
    def make_histogram(col_name, bins=10):
        if col_name not in df.columns:
            return []
        series = df[col_name].dropna()
        counts, bin_edges = np.histogram(series, bins=bins)
        res = []
        for i in range(len(counts)):
            res.append({
                "range": f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}",
                "count": int(counts[i]),
                "start": round(float(bin_edges[i]), 1),
                "end": round(float(bin_edges[i+1]), 1)
            })
        return res

    # Calculate comparisons by Diagnosis (0 vs 1)
    df_non_ad = df[df["Diagnosis"] == 0]
    df_ad = df[df["Diagnosis"] == 1]

    key_numerical = [
        "Age", "BMI", "AlcoholConsumption", "PhysicalActivity",
        "DietQuality", "SleepQuality", "SystolicBP", "DiastolicBP",
        "CholesterolTotal", "CholesterolLDL", "CholesterolHDL",
        "CholesterolTriglycerides", "MMSE", "FunctionalAssessment", "ADL"
    ]

    mean_comparisons = []
    for col in key_numerical:
        if col in df.columns:
            meta = FEATURE_METADATA.get(col, {})
            mean_non_ad = float(df_non_ad[col].mean())
            mean_ad = float(df_ad[col].mean())
            mean_comparisons.append({
                "feature": col,
                "label": meta.get("label", col),
                "mean_non_ad": round(mean_non_ad, 2),
                "mean_ad": round(mean_ad, 2),
                "diff": round(mean_ad - mean_non_ad, 2)
            })

    # Top feature correlations with Diagnosis
    corr_series = df[FEATURE_COLUMNS + ["Diagnosis"]].corr()["Diagnosis"].drop("Diagnosis")
    top_pos_corr = corr_series.sort_values(ascending=False).head(8)
    top_neg_corr = corr_series.sort_values(ascending=True).head(8)

    correlations = []
    for feat, val in corr_series.sort_values(key=abs, ascending=False).items():
        correlations.append({
            "feature": feat,
            "label": FEATURE_METADATA.get(feat, {}).get("label", feat),
            "correlation": round(float(val), 4)
        })

    _CACHED_DATASET_SUMMARY = {
        "overview": {
            "total_records": total_records,
            "total_features": len(FEATURE_COLUMNS),
            "target_variable": "Diagnosis",
            "missing_values": int(df[FEATURE_COLUMNS].isnull().sum().sum()),
            "class_distribution": {
                "negative_count": non_ad_count,
                "negative_percentage": round((non_ad_count / total_records) * 100, 1),
                "positive_count": ad_count,
                "positive_percentage": round((ad_count / total_records) * 100, 1)
            }
        },
        "distributions": {
            "Age": make_histogram("Age", 8),
            "MMSE": make_histogram("MMSE", 8),
            "FunctionalAssessment": make_histogram("FunctionalAssessment", 8),
            "ADL": make_histogram("ADL", 8),
            "BMI": make_histogram("BMI", 8),
            "PhysicalActivity": make_histogram("PhysicalActivity", 8)
        },
        "mean_comparisons": mean_comparisons,
        "correlations": correlations[:15]
    }
    return _CACHED_DATASET_SUMMARY


@router.get("/summary")
def get_dataset_summary():
    return _build_dataset_summary()


@router.get("/features")
def get_feature_definitions():
    return {
        "total": len(FEATURE_DEFINITIONS),
        "categories": ["Demographics", "Lifestyle", "Medical History", "Clinical Measurements", "Cognitive & Symptoms"],
        "features": FEATURE_DEFINITIONS
    }
