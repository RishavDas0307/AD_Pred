import os
import pandas as pd
import numpy as np
from fastapi import APIRouter
from joblib import load
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, roc_curve, auc

from app.services.model_loader import MODELS, FEATURE_COLUMNS, BASE_DIR

router = APIRouter(prefix="/evaluation", tags=["evaluation"])

_CACHED_EVALUATION = None


def _compute_evaluation_metrics():
    global _CACHED_EVALUATION
    if _CACHED_EVALUATION is not None:
        return _CACHED_EVALUATION

    # 1. Read static benchmark CSV
    csv_path = os.path.join(BASE_DIR, "ml", "evaluation", "model_comparison.csv")
    benchmarks = []
    if os.path.exists(csv_path):
        bench_df = pd.read_csv(csv_path)
        for _, row in bench_df.iterrows():
            benchmarks.append({
                "model_name": row["Model"],
                "accuracy": round(float(row["Accuracy"]), 4),
                "precision": round(float(row["Precision"]), 4),
                "recall": round(float(row["Recall"]), 4),
                "f1_score": round(float(row["F1 Score"]), 4),
                "roc_auc": round(float(row["ROC AUC"]), 4)
            })

    # 2. Compute live test evaluation for detailed confusion matrices & ROC curve coordinates
    data_path = os.path.join(BASE_DIR, "ml", "datasets", "alzheimers_disease_data.csv")
    detailed_models = {}

    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        X = df[FEATURE_COLUMNS]
        y = df["Diagnosis"]
        _, X_test, _, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        model_key_map = {
            "Random Forest": "random_forest",
            "XGBoost": "xgboost",
            "SVM": "svm",
            "Logistic Regression": "logistic_regression"
        }

        for display_name, key in model_key_map.items():
            if key not in MODELS:
                continue
            model = MODELS[key]
            y_pred = model.predict(X_test)
            cm = confusion_matrix(y_test, y_pred)
            tn, fp, fn, tp = cm.ravel()

            # ROC curve
            roc_points = []
            auc_score = 0.0
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_test)[:, 1]
                fpr, tpr, _ = roc_curve(y_test, y_prob)
                auc_score = float(auc(fpr, tpr))
                # Downsample ROC points for clean frontend rendering (e.g. 25 points)
                idx = np.linspace(0, len(fpr) - 1, min(25, len(fpr))).astype(int)
                for i in idx:
                    roc_points.append({
                        "fpr": round(float(fpr[i]), 4),
                        "tpr": round(float(tpr[i]), 4)
                    })

            detailed_models[key] = {
                "key": key,
                "display_name": display_name,
                "confusion_matrix": {
                    "tn": int(tn),
                    "fp": int(fp),
                    "fn": int(fn),
                    "tp": int(tp),
                    "total": int(len(y_test)),
                    "sensitivity": round(float(tp / (tp + fn)), 4) if (tp + fn) > 0 else 0,
                    "specificity": round(float(tn / (tn + fp)), 4) if (tn + fp) > 0 else 0,
                    "precision": round(float(tp / (tp + fp)), 4) if (tp + fp) > 0 else 0,
                    "accuracy": round(float((tp + tn) / (tp + tn + fp + fn)), 4)
                },
                "roc_curve": roc_points,
                "roc_auc": round(auc_score, 4)
            }

    _CACHED_EVALUATION = {
        "benchmarks": benchmarks,
        "models": detailed_models,
        "test_sample_count": 430
    }
    return _CACHED_EVALUATION


@router.get("/metrics")
def get_evaluation_metrics():
    return _compute_evaluation_metrics()
