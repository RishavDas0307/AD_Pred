# 🧠 AD_Pred — Alzheimer's Disease Prediction System

A full-stack machine learning web application that predicts the likelihood of Alzheimer's Disease based on patient clinical data. Built with a **FastAPI** backend serving trained ML models and SHAP explainability, and a modern **React + Vite + Tailwind CSS** frontend.

---

## 📌 Problem Statement

Alzheimer's Disease is a progressive neurodegenerative disorder and the most common cause of dementia. Early detection is critical for better patient outcomes, yet diagnosis remains difficult in clinical settings. This project aims to assist early screening by predicting whether a patient is likely to have Alzheimer's Disease based on clinical and demographic features, using supervised machine learning with explainable AI (XAI).

---

## 🗂️ Project Structure

```
AD_Pred/
├── backend/                    # FastAPI backend API
│   ├── app/
│   │   ├── routes/             # API routes (predict, explain)
│   │   ├── schemas/            # Pydantic data schemas
│   │   ├── services/           # Model loading, predictions & SHAP services
│   │   └── main.py             # FastAPI entry point & CORS configuration
│   └── requirements.txt        # Backend Python dependencies
│
├── frontend/                   # React + Vite frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer)
│   │   ├── pages/              # Application pages (Home, Predictor, Research, Docs)
│   │   ├── App.jsx             # React routing
│   │   └── main.jsx            # React root entry point
│   ├── package.json            # Node.js dependencies and scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite build tool configuration
│
├── ml/                         # Machine learning pipeline
│   ├── datasets/               # Dataset (alzheimers_disease_data.csv)
│   ├── evaluation/             # Model metrics, ROC curves, confusion matrices
│   ├── notebooks/              # Jupyter notebooks for model training & EDA
│   └── trained_models/         # Serialized models (.pkl) & feature columns
│
└── README.md
```

---

## 📊 Dataset

- **Source**: [Kaggle — Alzheimer's Disease Dataset](https://www.kaggle.com/)
- **Type**: Tabular / Clinical data
- **Target Variable**: Diagnosis (Binary — `1`: Alzheimer's Positive, `0`: Alzheimer's Negative)

### Key Features Used

| Feature | Description |
|---|---|
| Age | Patient's age in years |
| Gender | Male / Female |
| BMI | Body Mass Index |
| MMSE | Mini-Mental State Examination score |
| FamilyHistoryAlzheimers | Family history of Alzheimer's (Yes/No) |
| CardiovascularDisease | Presence of cardiovascular disease (Yes/No) |
| Depression | History of depression (Yes/No) |
| PhysicalActivity | Weekly physical activity level |
| SleepQuality | Self-reported sleep quality score |
| CholesterolTotal | Total cholesterol level |
| FunctionalAssessment | Functional ability score |
| MemoryComplaints | Self-reported memory complaints (Yes/No) |
| BehavioralProblems | Presence of behavioral problems (Yes/No) |
| ADL | Activities of Daily Living score |

---

## 🤖 Models Trained

Multiple classification models were trained, evaluated, and compared:

| Model | Accuracy | Precision | Recall | F1 Score | ROC AUC |
|---|---|---|---|---|---|
| **Random Forest** (Best) | **95.12%** | **94.56%** | **91.45%** | **92.98%** | **93.74%** |
| **XGBoost** | 94.65% | 93.88% | 90.79% | 92.31% | 94.47% |
| **SVM** | 84.19% | 74.42% | 84.21% | 79.01% | 89.74% |
| **Logistic Regression** | 81.63% | 69.52% | 85.53% | 76.70% | 88.31% |

### Best Model: Random Forest Classifier

The **Random Forest** classifier achieved the highest overall accuracy (95.12%) and F1 score (92.98%), providing dependable clinical risk screening.

---

## 🖥️ Features

- 🩺 **Multi-Step Assessment Form**: Guided clinical data input across demographics, lifestyle, clinical measures, and cognitive symptoms.
- ⚡ **Instant Multi-Model Predictions**: Get binary diagnosis risk and probability scores using Random Forest, XGBoost, SVM, or Logistic Regression.
- 🔍 **SHAP Explainable AI**: Feature attribution analysis identifying the top contributing risk factors behind each prediction.
- 📊 **Research & Benchmarks**: Interactive model comparison metrics and charts.
- 📖 **API Documentation**: Built-in interactive documentation and OpenAPI integration.

---

## ⚙️ How to Run

### Prerequisites

Ensure you have the following installed on your machine:
- **Python 3.10+** & `pip`
- **Node.js 18+** & `npm`
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/RishavDas0307/AD_Pred.git
cd AD_Pred
```

---

### 2. Run the Backend API (FastAPI)

Open a terminal window and run:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate the virtual environment
# On Linux / macOS:
source venv/bin/activate
# On Windows (PowerShell):
# .\venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
# .\venv\Scripts\activate.bat

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server with auto-reload
uvicorn app.main:app --reload --port 8000
```

- **Backend API URL**: `http://localhost:8000`
- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **Alternative API Docs (ReDoc)**: `http://localhost:8000/redoc`

---

### 3. Run the Website Frontend (React + Vite)

Open a **separate terminal window** and run:

```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

- **Website URL**: `http://localhost:5173`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API health check |
| `GET` | `/models` | List all available trained models |
| `POST` | `/predict` | Run prediction for a single model (returns prediction & probability) |
| `POST` | `/predict/all` | Run all 4 models simultaneously on clinical features |
| `POST` | `/explain` | SHAP-based feature importance & contribution analysis |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend API** | FastAPI, Uvicorn, Pydantic |
| **Frontend UI** | React 19, Vite, Tailwind CSS, React Router |
| **ML & Explainability** | Scikit-learn, XGBoost, SHAP, Joblib |
| **Data Processing** | Pandas, NumPy |
| **Notebooks & Charts** | Jupyter, Matplotlib, Seaborn |

---

## 👥 Team

| Name | Role |
|---|---|
| Rishav Das | ML, Backend, Frontend |

---

## 📚 References

- [Kaggle Alzheimer's Dataset](https://www.kaggle.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [SHAP (SHapley Additive exPlanations)](https://shap.readthedocs.io/)

---

## ⚠️ Disclaimer

This tool is intended for **academic and educational purposes only**. It is **not a substitute for professional medical diagnosis**. Always consult a qualified healthcare professional for medical advice.