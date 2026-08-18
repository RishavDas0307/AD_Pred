import { useState } from 'react';
import {
  Code2,
  FileCode,
  CheckCircle2,
  Copy,
  Terminal,
  Send,
  Layers,
  Sparkles
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const endpoints = [
  {
    method: 'POST',
    path: '/predict',
    title: 'Single Model Prediction & SHAP Attribution',
    desc: 'Runs inference using the specified ML model (random_forest, xgboost, svm, logistic_regression) and returns the binary prediction, risk probability, and ranked natural language SHAP factor explanations.',
    request: `{
  "model": "random_forest",
  "features": {
    "Age": 72.0,
    "Gender": 0,
    "Ethnicity": 0,
    "EducationLevel": 1,
    "BMI": 26.5,
    "Smoking": 0,
    "AlcoholConsumption": 5.0,
    "PhysicalActivity": 3.0,
    "DietQuality": 6.0,
    "SleepQuality": 7.0,
    "FamilyHistoryAlzheimers": 1,
    "CardiovascularDisease": 0,
    "Diabetes": 0,
    "Depression": 0,
    "HeadInjury": 0,
    "Hypertension": 0,
    "SystolicBP": 130.0,
    "DiastolicBP": 85.0,
    "CholesterolTotal": 210.0,
    "CholesterolLDL": 130.0,
    "CholesterolHDL": 50.0,
    "CholesterolTriglycerides": 160.0,
    "MMSE": 16.0,
    "FunctionalAssessment": 4.5,
    "MemoryComplaints": 1,
    "BehavioralProblems": 0,
    "ADL": 4.0,
    "Confusion": 0,
    "Disorientation": 0,
    "PersonalityChanges": 0,
    "DifficultyCompletingTasks": 0,
    "Forgetfulness": 1
  }
}`,
    response: `{
  "model": "random_forest",
  "prediction": 1,
  "probability": 0.884,
  "explanations": [
    {
      "feature": "MMSE",
      "label": "Cognitive assessment (MMSE score)",
      "value": 16.0,
      "formatted_value": "16.0 / 30",
      "contribution": 0.215,
      "abs_contribution": 0.215,
      "impact": "increased_risk",
      "statement": "Lower MMSE cognitive score (16.0 / 30) contributed significantly to the estimated risk."
    },
    {
      "feature": "MemoryComplaints",
      "label": "Reported memory complaints",
      "value": 1,
      "formatted_value": "Present",
      "contribution": 0.142,
      "abs_contribution": 0.142,
      "impact": "increased_risk",
      "statement": "Reported memory complaints increased the estimated risk."
    }
  ]
}`
  },
  {
    method: 'POST',
    path: '/predict/all',
    title: 'Multi-Model Consensus Inference',
    desc: 'Runs inference simultaneously across all 4 trained models (Random Forest, XGBoost, SVM, Logistic Regression) to verify algorithmic consensus.',
    request: `{
  "model": "random_forest",
  "features": { ... }
}`,
    response: `{
  "random_forest": { "prediction": 1, "probability": 0.884, "explanations": [ ... ] },
  "xgboost": { "prediction": 1, "probability": 0.862, "explanations": [ ... ] },
  "svm": { "prediction": 1, "probability": 0.815, "explanations": [ ... ] },
  "logistic_regression": { "prediction": 1, "probability": 0.792, "explanations": [ ... ] }
}`
  },
  {
    method: 'POST',
    path: '/explain',
    title: 'SHAP Feature Attribution Service',
    desc: 'Computes local feature contribution values and natural language clinical statements for any model.',
    request: `{
  "model": "xgboost",
  "features": { ... }
}`,
    response: `{
  "model": "xgboost",
  "top_features": [
    ["MMSE", 0.245],
    ["FunctionalAssessment", 0.182],
    ["MemoryComplaints", 0.115]
  ],
  "explanations": [ ... ]
}`
  },
  {
    method: 'GET',
    path: '/evaluation/metrics',
    title: 'Model Evaluation Benchmarks & ROC Data',
    desc: 'Returns stored benchmark metrics from model_comparison.csv, 2x2 test confusion matrices, and ROC curve coordinates for all 4 models.',
    request: null,
    response: `{
  "benchmarks": [
    { "model_name": "Random Forest", "accuracy": 0.9512, "precision": 0.9456, "recall": 0.9145, "f1_score": 0.9298, "roc_auc": 0.9374 },
    { "model_name": "XGBoost", "accuracy": 0.9465, "precision": 0.9388, "recall": 0.9079, "f1_score": 0.9231, "roc_auc": 0.9447 }
  ],
  "models": { ... },
  "test_sample_count": 430
}`
  },
  {
    method: 'GET',
    path: '/dataset/summary',
    title: 'Clinical Dataset Summary & Statistics',
    desc: 'Returns computed statistics from alzheimers_disease_data.csv including total cohort count, class balance, numerical distributions, and correlations.',
    request: null,
    response: `{
  "overview": {
    "total_records": 2149,
    "total_features": 32,
    "missing_values": 0,
    "class_distribution": { "negative_count": 1389, "positive_count": 760 }
  },
  "distributions": { ... },
  "mean_comparisons": [ ... ]
}`
  },
  {
    method: 'GET',
    path: '/dataset/features',
    title: 'Clinical Data Dictionary Specification',
    desc: 'Returns the full definition metadata for all 32 clinical features (labels, categories, ranges, units, options, and descriptions).',
    request: null,
    response: `{
  "total": 32,
  "categories": ["Demographics", "Lifestyle", "Medical History", "Clinical Measurements", "Cognitive & Symptoms"],
  "features": [ ... ]
}`
  },
  {
    method: 'GET',
    path: '/health',
    title: 'System Health Check',
    desc: 'Verifies FastAPI server readiness and confirms trained model artifacts are loaded.',
    request: null,
    response: `{ "status": "healthy", "models_loaded": 4, "dataset_connected": true }`
  }
];

export default function Docs() {
  const [copiedIdx, setCopiedIdx] = useState(null);

  function copyToClipboard(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Developer &amp; Clinical API</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant font-bold">
            REST v1.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-1">
          API Reference &amp; Integration Guide
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-variant mt-1 max-w-3xl leading-relaxed">
          Technical specifications for integrating the AD_Pred inference engine, dataset services, and SHAP explainability pipelines.
        </p>
      </div>

      {/* Base URL Box */}
      <div className="clinical-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-primary shrink-0" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-variant">Base API Endpoint</span>
            <div className="font-mono text-sm font-bold text-charcoal">http://localhost:8000</div>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold w-fit">
          CORS Enabled (Local Dev &amp; Production)
        </span>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <div key={ep.path} className="clinical-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                  ep.method === 'POST' ? 'bg-primary text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-bold text-charcoal">{ep.path}</span>
              </div>
              <h3 className="text-xs font-bold text-charcoal-variant">{ep.title}</h3>
            </div>

            <p className="text-xs text-charcoal-variant leading-relaxed">{ep.desc}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {/* Request */}
              {ep.request && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-charcoal-variant mb-1">
                    <span>Request Body (JSON)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ep.request, `req-${idx}`)}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedIdx === `req-${idx}` ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-charcoal text-slate-100 font-mono text-[11px] overflow-x-auto max-h-56">
                    {ep.request}
                  </pre>
                </div>
              )}

              {/* Response */}
              <div className={ep.request ? '' : 'lg:col-span-2'}>
                <div className="flex items-center justify-between text-xs font-mono text-charcoal-variant mb-1">
                  <span>Response (JSON)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ep.response, `res-${idx}`)}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedIdx === `res-${idx}` ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-charcoal text-slate-100 font-mono text-[11px] overflow-x-auto max-h-56">
                  {ep.response}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MedicalDisclaimer />
    </div>
  );
}