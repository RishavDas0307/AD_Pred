import { useState } from 'react';
import {
  Eye,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  Layers,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Play
} from 'lucide-react';
import { FeatureContributionBar } from '../components/Charts';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { api } from '../services/api';

const sampleCases = [
  {
    name: 'Cognitive Decline & Memory Loss',
    desc: 'Patient presenting with low MMSE (11.0) and memory complaints.',
    features: {
      Age: 79, Gender: 0, Ethnicity: 0, EducationLevel: 1, BMI: 27.0,
      Smoking: 0, AlcoholConsumption: 4.0, PhysicalActivity: 2.0, DietQuality: 4.0, SleepQuality: 6.0,
      FamilyHistoryAlzheimers: 1, CardiovascularDisease: 1, Diabetes: 0, Depression: 1, HeadInjury: 0, Hypertension: 1,
      SystolicBP: 145, DiastolicBP: 90, CholesterolTotal: 240, CholesterolLDL: 150, CholesterolHDL: 45, CholesterolTriglycerides: 210,
      MMSE: 11.0, FunctionalAssessment: 3.5, ADL: 3.8,
      MemoryComplaints: 1, BehavioralProblems: 1, Confusion: 1, Disorientation: 1, PersonalityChanges: 0, DifficultyCompletingTasks: 1, Forgetfulness: 1
    }
  },
  {
    name: 'High Physical Activity & Preserved Cognition',
    desc: 'Patient with strong cardiovascular fitness, optimal MMSE (29.0), and healthy lifestyle.',
    features: {
      Age: 65, Gender: 1, Ethnicity: 1, EducationLevel: 3, BMI: 22.0,
      Smoking: 0, AlcoholConsumption: 1.0, PhysicalActivity: 9.0, DietQuality: 9.0, SleepQuality: 8.5,
      FamilyHistoryAlzheimers: 0, CardiovascularDisease: 0, Diabetes: 0, Depression: 0, HeadInjury: 0, Hypertension: 0,
      SystolicBP: 118, DiastolicBP: 75, CholesterolTotal: 180, CholesterolLDL: 90, CholesterolHDL: 68, CholesterolTriglycerides: 105,
      MMSE: 29.0, FunctionalAssessment: 9.5, ADL: 9.5,
      MemoryComplaints: 0, BehavioralProblems: 0, Confusion: 0, Disorientation: 0, PersonalityChanges: 0, DifficultyCompletingTasks: 0, Forgetfulness: 0
    }
  },
  {
    name: 'Metabolic Risk & Borderline MMSE',
    desc: 'Patient with hypertension, elevated cholesterol, and intermediate MMSE (21.5).',
    features: {
      Age: 73, Gender: 0, Ethnicity: 0, EducationLevel: 2, BMI: 30.5,
      Smoking: 1, AlcoholConsumption: 8.0, PhysicalActivity: 3.0, DietQuality: 5.0, SleepQuality: 6.0,
      FamilyHistoryAlzheimers: 1, CardiovascularDisease: 0, Diabetes: 1, Depression: 0, HeadInjury: 0, Hypertension: 1,
      SystolicBP: 150, DiastolicBP: 95, CholesterolTotal: 260, CholesterolLDL: 165, CholesterolHDL: 38, CholesterolTriglycerides: 280,
      MMSE: 21.5, FunctionalAssessment: 6.0, ADL: 6.5,
      MemoryComplaints: 1, BehavioralProblems: 0, Confusion: 0, Disorientation: 0, PersonalityChanges: 0, DifficultyCompletingTasks: 0, Forgetfulness: 1
    }
  }
];

export default function Explainability() {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState('random_forest');
  const [explainData, setExplainData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runExplanation(caseIdx, model) {
    setLoading(true);
    try {
      const feat = sampleCases[caseIdx].features;
      const res = await api.getExplanation(model, feat);
      setExplainData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Explainable AI (XAI)</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant font-bold">
            SHAP Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-1">
          SHAP Feature Attribution &amp; Clinical Interpretability
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-variant mt-1 max-w-3xl leading-relaxed">
          Transparent, direction-aware explanations demonstrating how each clinical biomarker mathematically shifts the model's prediction toward or away from elevated Alzheimer's risk.
        </p>
      </div>

      {/* XAI Foundation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="clinical-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal">Shapley Additive Explanations</h3>
          <p className="text-xs text-charcoal-variant leading-relaxed">
            Based on cooperative game theory, SHAP attributes the exact marginal contribution of each clinical parameter to the overall risk probability score.
          </p>
        </div>

        <div className="clinical-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal">Risk-Elevating Factors (+)</h3>
          <p className="text-xs text-charcoal-variant leading-relaxed">
            Positive attributions (e.g., lower MMSE cognitive score, active memory complaints, family history) increase the predicted risk of cognitive decline.
          </p>
        </div>

        <div className="clinical-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold mb-2">
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal">Protective Factors (−)</h3>
          <p className="text-xs text-charcoal-variant leading-relaxed">
            Negative attributions (e.g., preserved MMSE score &gt;27, high physical activity, normal blood pressure) decrease the estimated risk profile.
          </p>
        </div>
      </div>

      {/* Interactive SHAP Sandbox */}
      <div className="clinical-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-charcoal-border pb-4 gap-3">
          <div>
            <h2 className="text-base font-bold text-charcoal">Interactive XAI Case Sandbox</h2>
            <p className="text-xs text-charcoal-variant">
              Select a clinical scenario and model to observe live SHAP attributions and generated clinical statements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                if (explainData) runExplanation(selectedCaseIdx, e.target.value);
              }}
              className="bg-white border border-charcoal-border rounded-lg px-3 py-1.5 text-xs font-semibold text-charcoal focus:outline-none focus:border-primary"
            >
              <option value="random_forest">Random Forest (TreeSHAP)</option>
              <option value="xgboost">XGBoost (TreeSHAP)</option>
              <option value="logistic_regression">Logistic Regression (Log-Odds)</option>
              <option value="svm">SVM (KernelSHAP)</option>
            </select>

            <button
              type="button"
              disabled={loading}
              onClick={() => runExplanation(selectedCaseIdx, selectedModel)}
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Computing...' : 'Run SHAP Attribution'}</span>
            </button>
          </div>
        </div>

        {/* Case Presets Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleCases.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                setSelectedCaseIdx(i);
                runExplanation(i, selectedModel);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedCaseIdx === i
                  ? 'bg-primary/5 border-primary shadow-xs'
                  : 'bg-white border-charcoal-border hover:bg-surface-container-low'
              }`}
            >
              <span className="text-xs font-bold text-charcoal block mb-1">{c.name}</span>
              <p className="text-[11px] text-charcoal-variant leading-snug">{c.desc}</p>
            </button>
          ))}
        </div>

        {/* Output Section */}
        {explainData ? (
          <div className="pt-4 border-t border-charcoal-border space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Ranked Feature Attributions for {sampleCases[selectedCaseIdx].name}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant">
                Model: {selectedModel.replace('_', ' ')}
              </span>
            </div>

            <FeatureContributionBar explanations={explainData.explanations} maxItems={6} />
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-container-low rounded-xl border border-charcoal-border text-xs text-charcoal-variant space-y-2">
            <p>Click "Run SHAP Attribution" above to calculate live feature importance for this patient case.</p>
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
