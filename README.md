# 🧠 AD_Pred — Alzheimer's Disease Prediction System

A machine learning web application that predicts the likelihood of Alzheimer's Disease based on patient clinical data. Built as a BTech Mini Project using Python, Scikit-learn, and Streamlit.

---

## 📌 Problem Statement

Alzheimer's Disease is a progressive neurodegenerative disorder and the most common cause of dementia. Early detection is critical for better patient outcomes, yet diagnosis remains difficult in clinical settings. This project aims to assist early screening by predicting whether a patient is likely to have Alzheimer's Disease based on clinical and demographic features, using supervised machine learning.

---

## 🗂️ Project Structure

```
AD_Pred/
│
├── ml/                        # Jupyter notebooks for EDA, preprocessing & model training
│   └── alzheimer_model.ipynb
│
├── backend/                   # Python backend serving the trained model
│   └── app.py
│
├── frontend/                  # Streamlit frontend for user interaction
│   └── streamlit_app.py
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

Multiple classification models were trained and compared:

| Model | Notes |
|---|---|
| Logistic Regression | Baseline model |
| Support Vector Machine (SVM) | Tested with RBF kernel |
| Random Forest | ✅ Best performing model |
| XGBoost | Gradient boosted trees |

### Best Model: Random Forest Classifier

The Random Forest model was selected for deployment based on its superior performance.

**Evaluation Metrics (Random Forest):**

| Metric | Score |
|---|---|
| Accuracy | *(add your value)* |
| Precision | *(add your value)* |
| Recall | *(add your value)* |
| F1 Score | *(add your value)* |

> 📝 Fill in the exact metric values from your notebook output.

---

## 🖥️ Application

The web application is built with **Streamlit**. The user fills a form with the patient's clinical data and receives an instant binary prediction:

- ✅ **Not Likely to have Alzheimer's**
- ⚠️ **Likely to have Alzheimer's**

---

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/RishavDas0307/AD_Pred.git
cd AD_Pred
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Train the model (optional — if model file not included)

Open and run the notebook in `ml/` to generate the trained model file (`.pkl`).

### 4. Run the Streamlit app

```bash
cd frontend
streamlit run streamlit_app.py
```

The app will open at `http://localhost:8501`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.x |
| ML Library | Scikit-learn, XGBoost |
| Data Processing | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |
| Frontend | Streamlit |
| Notebook | Jupyter |

---

## 👥 Team

| Name | Role |
|---|---|
| Rishav Das | ML, Backend, Frontend |
| *(add teammates)* | *(add roles)* |

---

## 📚 References

- [Kaggle Alzheimer's Dataset](https://www.kaggle.com/)
- Scikit-learn Documentation — https://scikit-learn.org
- Streamlit Documentation — https://docs.streamlit.io

---

## ⚠️ Disclaimer

This tool is intended for **academic and educational purposes only**. It is **not a substitute for professional medical diagnosis**. Always consult a qualified healthcare professional for medical advice.