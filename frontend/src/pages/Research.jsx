import {
  FlaskConical,
  Database,
  Sliders,
  Cpu,
  BarChart2,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const pipelineSteps = [
  { step: '01', title: 'Data Ingestion', desc: 'Collection and validation of 2,149 patient records with 32 structured clinical markers.' },
  { step: '02', title: 'Preprocessing', desc: 'StandardScaler feature normalization and stratified 80/20 train-test partitioning.' },
  { step: '03', title: 'EDA & Selection', desc: 'Multivariate correlation analysis prioritizing MMSE, ADL, and metabolic risk indicators.' },
  { step: '04', title: 'Model Training', desc: 'Hyperparameter-tuned Random Forest (500 estimators), XGBoost, SVM, and Logistic Regression.' },
  { step: '05', title: 'Evaluation', desc: 'Rigorous assessment across Sensitivity, Specificity, ROC-AUC (0.945), and F1 scores.' },
  { step: '06', title: 'SHAP Explainability', desc: 'Local and global feature attribution ensuring clinical transparency and interpretability.' }
];

const pythonPipelineCode = `# AD_Pred Classification & Scaling Pipeline
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# 1. Random Forest Pipeline (95.1% Accuracy)
rf_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('rf', RandomForestClassifier(
        n_estimators=500,
        random_state=42,
        class_weight='balanced'
    ))
])

# 2. XGBoost Pipeline (0.945 ROC-AUC)
xgb_model = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    eval_metric='logloss',
    random_state=42
)

# 3. Model Training & Serialization
rf_pipeline.fit(X_train, y_train)
joblib.dump(rf_pipeline, 'random_forest.pkl')`;

export default function Research() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Scientific Architecture</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant font-bold">
            Methodology v1.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-1">
          Research &amp; Algorithmic Methodology
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-variant mt-1 max-w-3xl leading-relaxed">
          A comprehensive technical overview of the AD_Pred clinical intelligence pipeline, detailing data handling, model architectures, and validation protocols for early-stage Alzheimer's risk assessment.
        </p>
      </div>

      {/* Methodology Pipeline Flow */}
      <div className="clinical-card p-6 space-y-4">
        <h2 className="text-base font-bold text-charcoal">End-to-End Methodology Pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-surface-container-low border border-charcoal-border flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-primary block mb-1">{s.step}</span>
                <h3 className="text-xs font-bold text-charcoal mb-1">{s.title}</h3>
                <p className="text-[11px] text-charcoal-variant leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statement & Research Abstract */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Statement (8 Cols) */}
        <div className="lg:col-span-8 clinical-card p-6 space-y-4">
          <div className="border-b border-charcoal-border pb-3">
            <h2 className="text-base font-bold text-charcoal">1. Problem Statement &amp; Clinical Need</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-variant leading-relaxed">
            Alzheimer's Disease (AD) is a progressive neurodegenerative disorder characterized by irreversible cognitive decline, memory impairment, and diminished daily autonomy. Early identification during pre-symptomatic or mild cognitive impairment (MCI) stages is crucial for therapeutic intervention and clinical trial stratification.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-variant leading-relaxed">
            While high-cost imaging modalities (such as Amyloid-PET) provide direct biomarker validation, access remains limited in primary care settings. AD_Pred addresses this gap by utilizing comprehensive, low-cost, readily accessible structured clinical markers—including demographic indicators, cognitive screening scores (MMSE), daily functional assessments (ADL), cardiovascular indices, and lifestyle parameters—to estimate risk accurately and transparently.
          </p>
        </div>

        {/* Right: Abstract Card (4 Cols) */}
        <div className="lg:col-span-4 clinical-card p-6 bg-gradient-to-br from-primary to-primary-dark text-white space-y-3">
          <div className="flex items-center gap-2 text-primary-light text-xs font-mono font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Research Abstract</span>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            This study evaluates four machine learning architectures on a 2,149-patient clinical cohort. Ensemble tree methods (Random Forest and XGBoost) achieved superior performance (95.1% accuracy, 0.945 ROC-AUC), with MMSE, functional independence, and family history identified as primary predictive drivers via SHAP attribution.
          </p>
          <div className="pt-3 border-t border-blue-400/30 flex justify-between font-mono text-xs text-white font-bold">
            <span>Accuracy: 95.1%</span>
            <span>AUC: 0.945</span>
          </div>
        </div>
      </div>

      {/* Methodology Details & Code Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Snippet (6 Cols) */}
        <div className="lg:col-span-6 clinical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-charcoal">Pipeline Implementation</h2>
              <p className="text-xs text-charcoal-variant">Python / scikit-learn / XGBoost</p>
            </div>
            <FileCode className="w-4 h-4 text-primary" />
          </div>

          <div className="p-4 rounded-xl bg-charcoal text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{pythonPipelineCode}</pre>
          </div>
        </div>

        {/* Right: Validation Protocol (6 Cols) */}
        <div className="lg:col-span-6 clinical-card p-6 space-y-4">
          <div className="border-b border-charcoal-border pb-3">
            <h2 className="text-sm font-bold text-charcoal">2. Validation &amp; Statistical Rigor</h2>
            <p className="text-xs text-charcoal-variant">Experimental controls applied to prevent overfitting.</p>
          </div>

          <div className="space-y-3 text-xs text-charcoal-variant">
            <div className="p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
              <strong className="text-charcoal block mb-0.5">Stratified Partitioning:</strong>
              An 80/20 train-test split preserved the 64.6% : 35.4% diagnosis ratio, preventing sample bias in evaluation.
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
              <strong className="text-charcoal block mb-0.5">Feature Normalization:</strong>
              Continuous variables were fitted with StandardScaler parameters derived exclusively from the training fold to avoid data leakage.
            </div>
            <div className="p-3 rounded-lg bg-surface-container-low border border-charcoal-border">
              <strong className="text-charcoal block mb-0.5">Interpretability Layer:</strong>
              TreeSHAP computed exact, additive Shapley values for tree ensembles without heuristic approximations.
            </div>
          </div>
        </div>
      </div>

      {/* Limitations & Future Scope */}
      <div className="clinical-card p-6 space-y-3 border-l-4 border-l-primary">
        <h2 className="text-base font-bold text-charcoal">3. Limitations &amp; Future Scope</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-charcoal-variant leading-relaxed list-disc list-inside">
          <li>
            <strong>Current Modality Scope:</strong> The active models strictly analyze structured clinical, demographic, lifestyle, cognitive, and functional features.
          </li>
          <li>
            <strong>Future Multi-Modal Extension:</strong> Prospective future iterations aim to incorporate neuroimaging (structural MRI, PET scans) and genomic biomarkers (APOE ε4 allele status), contingent upon acquiring multimodal validation datasets and training compatible architectures.
          </li>
          <li>
            <strong>Clinical Decision Support:</strong> AD_Pred is designed as an investigative decision-support assistant and does not constitute an automated medical diagnostic tool.
          </li>
        </ul>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}