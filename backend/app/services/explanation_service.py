import os
import numpy as np
import pandas as pd
import shap
from app.services.model_loader import MODELS, FEATURE_COLUMNS, get_model

# ---------------------------------------------------------------------------
# Semantic Feature Definitions & Direction-Aware Language Mappings
# ---------------------------------------------------------------------------

FEATURE_METADATA = {
    "Age": {
        "label": "Age",
        "format": lambda v: f"{int(round(v))} years old",
        "risk_inc": "Older age ({val}) contributed to the estimated risk.",
        "risk_dec": "Age ({val}) was associated with a lower estimated risk."
    },
    "Gender": {
        "label": "Gender",
        "format": lambda v: "Female" if int(v) == 1 else "Male",
        "risk_inc": "Demographic factor (Gender: {val}) was associated with an increase in estimated risk.",
        "risk_dec": "Demographic factor (Gender: {val}) was associated with a lower estimated risk."
    },
    "Ethnicity": {
        "label": "Ethnicity",
        "format": lambda v: {0: "Caucasian", 1: "African American", 2: "Asian", 3: "Other"}.get(int(v), "Other"),
        "risk_inc": "Demographic background ({val}) contributed slightly to the estimated risk profile.",
        "risk_dec": "Demographic background ({val}) was associated with a lower estimated risk."
    },
    "EducationLevel": {
        "label": "Education level",
        "format": lambda v: {0: "No formal education", 1: "High School", 2: "Bachelor's degree", 3: "Higher education"}.get(int(v), "High School"),
        "risk_inc": "Lower educational attainment ({val}) contributed to the estimated risk.",
        "risk_dec": "Higher educational attainment ({val}) was associated with a lower estimated risk."
    },
    "BMI": {
        "label": "Body mass index (BMI)",
        "format": lambda v: f"BMI of {float(v):.1f} kg/m²",
        "risk_inc": "Elevated {val} contributed to the estimated risk.",
        "risk_dec": "Healthier {val} was associated with a lower estimated risk."
    },
    "Smoking": {
        "label": "Smoking status",
        "format": lambda v: "Active smoker" if int(v) == 1 else "Non-smoker",
        "risk_inc": "History of smoking contributed to the estimated risk.",
        "risk_dec": "Non-smoking status was associated with a lower estimated risk."
    },
    "AlcoholConsumption": {
        "label": "Alcohol consumption",
        "format": lambda v: f"{float(v):.1f} units/week",
        "risk_inc": "Higher alcohol intake ({val}) contributed to the estimated risk.",
        "risk_dec": "Lower alcohol intake ({val}) was associated with a lower estimated risk."
    },
    "PhysicalActivity": {
        "label": "Physical activity level",
        "format": lambda v: f"{float(v):.1f} hrs/week",
        "risk_inc": "Lower physical activity ({val}) contributed to the estimated risk.",
        "risk_dec": "Higher physical activity ({val}) was associated with a lower estimated risk."
    },
    "DietQuality": {
        "label": "Diet quality",
        "format": lambda v: f"{float(v):.1f} / 10",
        "risk_inc": "Lower diet quality score ({val}) contributed to the estimated risk.",
        "risk_dec": "Healthy diet quality score ({val}) was associated with a lower estimated risk."
    },
    "SleepQuality": {
        "label": "Sleep quality",
        "format": lambda v: f"{float(v):.1f} / 10",
        "risk_inc": "Lower sleep quality score ({val}) contributed to the estimated risk.",
        "risk_dec": "Good sleep quality score ({val}) was associated with a lower estimated risk."
    },
    "FamilyHistoryAlzheimers": {
        "label": "Family history of Alzheimer’s",
        "format": lambda v: "Positive family history" if int(v) == 1 else "No family history",
        "risk_inc": "Reported family history of Alzheimer's contributed to the estimated risk.",
        "risk_dec": "Absence of family history of Alzheimer's was associated with a lower estimated risk."
    },
    "CardiovascularDisease": {
        "label": "Cardiovascular disease",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Presence of cardiovascular disease contributed to the estimated risk.",
        "risk_dec": "Absence of cardiovascular disease was associated with a lower estimated risk."
    },
    "Diabetes": {
        "label": "Diabetes",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Presence of diabetes contributed to the estimated risk.",
        "risk_dec": "Absence of diabetes was associated with a lower estimated risk."
    },
    "Depression": {
        "label": "History of depression",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Reported history of depression contributed to the estimated risk.",
        "risk_dec": "Absence of reported depression was associated with a lower estimated risk."
    },
    "HeadInjury": {
        "label": "History of head injury",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Prior history of head trauma contributed to the estimated risk.",
        "risk_dec": "No history of head trauma was associated with a lower estimated risk."
    },
    "Hypertension": {
        "label": "Hypertension",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Documented hypertension contributed to the estimated risk.",
        "risk_dec": "Normal blood pressure status was associated with a lower estimated risk."
    },
    "SystolicBP": {
        "label": "Systolic blood pressure",
        "format": lambda v: f"{int(round(v))} mmHg",
        "risk_inc": "Elevated systolic blood pressure ({val}) contributed to the estimated risk.",
        "risk_dec": "Controlled systolic blood pressure ({val}) was associated with a lower estimated risk."
    },
    "DiastolicBP": {
        "label": "Diastolic blood pressure",
        "format": lambda v: f"{int(round(v))} mmHg",
        "risk_inc": "Elevated diastolic blood pressure ({val}) contributed to the estimated risk.",
        "risk_dec": "Controlled diastolic blood pressure ({val}) was associated with a lower estimated risk."
    },
    "CholesterolTotal": {
        "label": "Total cholesterol",
        "format": lambda v: f"{int(round(v))} mg/dL",
        "risk_inc": "Elevated total cholesterol ({val}) contributed to the estimated risk.",
        "risk_dec": "Controlled total cholesterol ({val}) was associated with a lower estimated risk."
    },
    "CholesterolLDL": {
        "label": "LDL cholesterol",
        "format": lambda v: f"{int(round(v))} mg/dL",
        "risk_inc": "Higher LDL ('bad') cholesterol ({val}) contributed to the estimated risk.",
        "risk_dec": "Lower LDL ('bad') cholesterol ({val}) was associated with a lower estimated risk."
    },
    "CholesterolHDL": {
        "label": "HDL cholesterol",
        "format": lambda v: f"{int(round(v))} mg/dL",
        "risk_inc": "Lower protective HDL cholesterol ({val}) contributed to the estimated risk.",
        "risk_dec": "Higher protective HDL cholesterol ({val}) was associated with a lower estimated risk."
    },
    "CholesterolTriglycerides": {
        "label": "Triglycerides",
        "format": lambda v: f"{int(round(v))} mg/dL",
        "risk_inc": "Elevated triglyceride level ({val}) contributed to the estimated risk.",
        "risk_dec": "Healthy triglyceride level ({val}) was associated with a lower estimated risk."
    },
    "MMSE": {
        "label": "Cognitive assessment (MMSE score)",
        "format": lambda v: f"{float(v):.1f} / 30",
        "risk_inc": "Lower MMSE cognitive score ({val}) contributed significantly to the estimated risk.",
        "risk_dec": "Preserved MMSE cognitive score ({val}) was strongly associated with a lower estimated risk."
    },
    "FunctionalAssessment": {
        "label": "Functional assessment",
        "format": lambda v: f"{float(v):.1f} / 10",
        "risk_inc": "Reduced functional ability score ({val}) contributed significantly to the estimated risk.",
        "risk_dec": "High functional ability score ({val}) was associated with a lower estimated risk."
    },
    "MemoryComplaints": {
        "label": "Reported memory complaints",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Reported memory complaints increased the estimated risk.",
        "risk_dec": "Absence of reported memory complaints was associated with a lower estimated risk."
    },
    "BehavioralProblems": {
        "label": "Behavioral problems",
        "format": lambda v: "Present" if int(v) == 1 else "Absent",
        "risk_inc": "Reported behavioral problems increased the estimated risk.",
        "risk_dec": "Absence of behavioral problems was associated with a lower estimated risk."
    },
    "ADL": {
        "label": "Activities of Daily Living (ADL)",
        "format": lambda v: f"{float(v):.1f} / 10",
        "risk_inc": "Lower independence in Activities of Daily Living ({val}) contributed to the estimated risk.",
        "risk_dec": "Preserved Activities of Daily Living score ({val}) was associated with a lower estimated risk."
    },
    "Confusion": {
        "label": "Reported confusion",
        "format": lambda v: "Reported" if int(v) == 1 else "None reported",
        "risk_inc": "Reported episodes of confusion contributed to the estimated risk.",
        "risk_dec": "Absence of confusion episodes was associated with a lower estimated risk."
    },
    "Disorientation": {
        "label": "Reported disorientation",
        "format": lambda v: "Reported" if int(v) == 1 else "None reported",
        "risk_inc": "Reported disorientation contributed to the estimated risk.",
        "risk_dec": "No reported disorientation was associated with a lower estimated risk."
    },
    "PersonalityChanges": {
        "label": "Reported personality changes",
        "format": lambda v: "Reported" if int(v) == 1 else "None reported",
        "risk_inc": "Reported personality changes contributed to the estimated risk.",
        "risk_dec": "No reported personality changes was associated with a lower estimated risk."
    },
    "DifficultyCompletingTasks": {
        "label": "Difficulty completing tasks",
        "format": lambda v: "Reported" if int(v) == 1 else "None reported",
        "risk_inc": "Reported difficulty completing everyday tasks contributed to the estimated risk.",
        "risk_dec": "No reported difficulty completing tasks was associated with a lower estimated risk."
    },
    "Forgetfulness": {
        "label": "Reported forgetfulness",
        "format": lambda v: "Reported" if int(v) == 1 else "None reported",
        "risk_inc": "Reported persistent forgetfulness contributed to the estimated risk.",
        "risk_dec": "Absence of frequent forgetfulness was associated with a lower estimated risk."
    }
}

# ---------------------------------------------------------------------------
# Model Explainer Cache & Extraction
# ---------------------------------------------------------------------------

_EXPLAINERS = {}


def _get_tree_explainer(model_name: str):
    if model_name not in _EXPLAINERS:
        model = get_model(model_name)
        _EXPLAINERS[model_name] = shap.TreeExplainer(model)
    return _EXPLAINERS[model_name]


def calculate_feature_contributions(model_name: str, features: dict) -> dict[str, float]:
    """
    Computes exact, direction-aware feature contributions towards class 1 (Elevated Risk)
    for any supported model (Random Forest, XGBoost, Logistic Regression, SVM).
    """
    model = get_model(model_name)
    df = pd.DataFrame([features])
    df = df.reindex(columns=FEATURE_COLUMNS, fill_value=0)
    df = df.apply(pd.to_numeric, errors="coerce").fillna(0.0)

    contributions: dict[str, float] = {}

    if model_name == "random_forest":
        explainer = _get_tree_explainer("random_forest")
        sv = np.array(explainer.shap_values(df))
        if sv.ndim == 3 and sv.shape[2] == 2:
            # (n_samples, n_features, n_classes) -> take class 1
            vals = sv[0, :, 1]
        elif sv.ndim == 3 and sv.shape[0] == 2:
            # (n_classes, n_samples, n_features) -> take class 1
            vals = sv[1, 0, :]
        elif sv.ndim == 2:
            vals = sv[0]
        else:
            vals = sv.flatten()
        for feat, val in zip(FEATURE_COLUMNS, vals):
            contributions[feat] = float(val)

    elif model_name == "xgboost":
        explainer = _get_tree_explainer("xgboost")
        sv = np.array(explainer.shap_values(df))
        vals = sv[0] if sv.ndim == 2 else sv.flatten()
        for feat, val in zip(FEATURE_COLUMNS, vals):
            contributions[feat] = float(val)

    elif model_name == "logistic_regression":
        # Logistic Regression is a Pipeline([('scaler', StandardScaler()), ('lr', LogisticRegression())])
        scaler = model.named_steps["scaler"]
        lr_clf = model.named_steps["lr"]
        x_scaled = scaler.transform(df)
        coefs = lr_clf.coef_[0]
        # Standardized additive log-odds contribution
        linear_contributions = coefs * x_scaled[0]
        for feat, val in zip(FEATURE_COLUMNS, linear_contributions):
            contributions[feat] = float(val)

    elif model_name == "svm":
        # SVM is Pipeline([('scaler', StandardScaler()), ('svc', SVC(probability=True))])
        scaler = model.named_steps["scaler"]
        svc = model.named_steps["svc"]
        x_scaled = scaler.transform(df)
        # Fast local sensitivity / Kernel attribution with zero-scaled baseline
        bg = np.zeros((1, len(FEATURE_COLUMNS)))
        ke = shap.KernelExplainer(lambda x: svc.predict_proba(x)[:, 1], bg)
        sv = ke.shap_values(x_scaled, nsamples=60, l1_reg="auto")
        vals = sv[0] if isinstance(sv, list) or (isinstance(sv, np.ndarray) and sv.ndim > 1) else sv
        for feat, val in zip(FEATURE_COLUMNS, vals):
            contributions[feat] = float(val)

    else:
        # Fallback for unknown model
        for feat in FEATURE_COLUMNS:
            contributions[feat] = 0.0

    return contributions


def generate_explanations(
    model_name: str,
    features: dict,
    top_k: int = 5,
    min_threshold: float = 1e-4
) -> list[dict]:
    """
    Produces ranked, direction-aware natural-language explanations based on the model's
    actual feature contributions and patient input values.
    """
    raw_contributions = calculate_feature_contributions(model_name, features)

    # Sort descending by absolute contribution magnitude
    ranked_features = sorted(
        raw_contributions.items(),
        key=lambda item: abs(item[1]),
        reverse=True
    )

    explanations = []
    for feat_name, contribution in ranked_features:
        if abs(contribution) < min_threshold:
            continue

        meta = FEATURE_METADATA.get(feat_name, {})
        val = features.get(feat_name, 0.0)

        label = meta.get("label", feat_name)
        fmt_func = meta.get("format", lambda v: str(v))
        formatted_val = fmt_func(val)

        is_risk_increase = contribution > 0
        impact = "increased_risk" if is_risk_increase else "lower_risk"

        if is_risk_increase:
            template = meta.get("risk_inc", "{label} ({val}) contributed to the estimated risk.")
        else:
            template = meta.get("risk_dec", "{label} ({val}) was associated with a lower estimated risk.")

        statement = template.format(label=label, val=formatted_val)

        explanations.append({
            "feature": feat_name,
            "label": label,
            "value": val,
            "formatted_value": formatted_val,
            "contribution": float(contribution),
            "abs_contribution": float(abs(contribution)),
            "impact": impact,
            "statement": statement
        })

        if len(explanations) >= top_k:
            break

    return explanations
